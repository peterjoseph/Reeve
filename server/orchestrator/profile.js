import bcrypt from "bcrypt";
import uniqid from "uniqid";
import moment from "moment";

import config from "../../config";

import { database, models } from "services/sequelize";
import { sendEmail } from "services/nodemailer";
import { presignedPutObject, checkObjectExists, deleteObject } from "services/s3";

import { variableExists } from "shared/utilities/filters";
import { t } from "shared/translations/i18n";
import { EMAIL_TYPE, LANGUAGE_CODES, SIGNED_URL_EXPIRY_TIME, ACL_POLICIES } from "shared/constants";
import { ServerResponseError } from "utilities/errors/serverResponseError";

// Load user profile
export function loadProfile(requestProperties, authenticatedUser, browserLng) {
	return database().transaction(async function(transaction) {
		try {
			// Load client for authenticated user
			const client = await models().client.findOne({ where: { id: authenticatedUser.clientId, active: true } }, { transaction: transaction });

			// Throw an error if the client does not exist
			if (client === null) {
				throw new ServerResponseError(403, t("validation.loadUserPropertiesFailed", { lng: browserLng }), { client: [t("validation.loadClientFailed", { lng: browserLng })] });
			}

			// Load user properties for authenticated user
			const user = await models().user.findOne({ where: { id: authenticatedUser.userId, clientId: client.get("id"), active: true } }, { transaction: transaction });

			// Throw an error if the user does not exist
			if (user === null) {
				throw new ServerResponseError(403, t("validation.loadUserPropertiesFailed", { lng: browserLng }), { user: [t("validation.loadUserPropertiesFailed", { lng: browserLng })] });
			}

			// Create user properties object to be returned back to the front-end
			let userProperties = {
				userId: user.get("id"),
				firstName: user.get("firstName"),
				lastName: user.get("lastName"),
				emailAddress: user.get("emailAddress"),
				bio: user.get("bio"),
				location: user.get("location"),
				website: user.get("website")
			};

			// Create a response object
			const response = { status: 200, message: t("label.success", { lng: browserLng }), user: userProperties };

			// Return the response object
			return response;
		} catch (error) {
			throw error;
		}
	});
}

// Update user profile
export function updateProfile(requestProperties, authenticatedUser, browserLng) {
	return database().transaction(async function(transaction) {
		try {
			// Load client for authenticated user
			const client = await models().client.findOne({ where: { id: authenticatedUser.clientId, active: true } }, { transaction: transaction });

			// Throw an error if the client does not exist
			if (client === null) {
				throw new ServerResponseError(403, t("validation.loadUserPropertiesFailed", { lng: browserLng }), { client: [t("validation.loadClientFailed", { lng: browserLng })] });
			}

			// Load user properties for authenticated user
			const user = await models().user.findOne({ where: { id: authenticatedUser.userId, clientId: client.get("id"), active: true } }, { transaction: transaction });

			// Throw an error if the user does not exist
			if (user === null) {
				throw new ServerResponseError(403, t("validation.loadUserPropertiesFailed", { lng: browserLng }), { user: [t("validation.loadUserPropertiesFailed", { lng: browserLng })] });
			}

			const updateParams = {
				firstName: requestProperties.firstName,
				lastName: requestProperties.lastName,
				bio: requestProperties.bio,
				location: requestProperties.location,
				website: requestProperties.website
			};

			// Send verification email if user is attempting to change email address
			if (requestProperties.emailAddress !== user.get("emailAddress")) {
				// Check if email of type CHANGE_EMAIL_ADDRESS sent in the last 5 minutes
				const currentTime = new Date();
				const lastEmail = await models().sentEmails.findAll(
					{
						where: {
							to: requestProperties.emailAddress,
							emailType: EMAIL_TYPE.CHANGE_EMAIL_ADDRESS,
							createdAt: {
								[database().Op.between]: [
									// Find all emails of type sent in last 5 minutes
									moment(currentTime)
										.subtract(5, "minutes")
										.format("YYYY-MM-DD HH:mm:ss"),
									moment(currentTime).format("YYYY-MM-DD HH:mm:ss")
								]
							}
						}
					},
					{ transaction: transaction }
				);

				// Continue if no emails of type CHANGE_EMAIL_ADDRESS sent in the last 5 minutes
				if (lastEmail === null || lastEmail.length === 0) {
					// Generate password reset code for each account
					const emailCode = uniqid();

					// Store validation code in table
					await models().changeEmailAddress.create(
						{
							emailCode: emailCode,
							activated: false,
							userId: user.get("id"),
							clientId: user.get("clientId"),
							gracePeriod: 2,
							oldEmailAddress: user.get("emailAddress"),
							newEmailAddress: requestProperties.emailAddress
						},
						{ transaction: transaction }
					);

					// Create emailParams object
					const emailParams = {
						firstName: user.get("firstName"),
						lastName: user.get("lastName"),
						clientName: client.get("workspaceURL"),
						changeEmailLink: `${config.build.protocol}://${client.get("workspaceURL")}.${config.build.domainPath}/verify/email_change#code=${emailCode}`
					};

					// Send verify email address message
					sendEmail(EMAIL_TYPE.CHANGE_EMAIL_ADDRESS, user.get("language"), requestProperties.emailAddress, emailParams, user.get("clientId"), user.get("id"));
				}
			}

			// Update user row with new information
			user.update(updateParams);

			// Create a response object
			const response = { status: 200, message: t("label.success", { lng: browserLng }) };

			// Return the response object
			return response;
		} catch (error) {
			throw error;
		}
	});
}

// Verify User Email Change Code
export function verifyUserEmailChange(requestProperties, authenticatedUser, browserLng) {
	return database().transaction(async function(transaction) {
		try {
			// Load client from workspace url
			const client = await models().client.findOne({ where: { workspaceURL: requestProperties.workspaceURL, active: true } }, { transaction: transaction });

			// Throw an error if the client does not exist
			if (client === null) {
				throw new ServerResponseError(403, t("validation.verifyChangeEmailInvalidProperties", { lng: browserLng }), { client: [t("validation.loadClientFailed", { lng: browserLng })] });
			}

			// Determine values to use in fetching the email verification code
			const where = {
				emailCode: requestProperties.code
			};

			if (variableExists(requestProperties.userId)) {
				where.userId = requestProperties.userId;
			}

			// Check if change email address code is valid
			const changeEmailAddressCode = await models().changeEmailAddress.findOne({ where: where }, { transaction: transaction });

			// Throw error if code could not be found
			if (changeEmailAddressCode === null) {
				throw new ServerResponseError(403, t("validation.verifyChangeEmailInvalidProperties", { lng: browserLng }), { code: [t("validation.emptyChangeEmailCode", { lng: browserLng })] });
			}

			// Confirm different states of the change email address code
			if (Boolean(Number(changeEmailAddressCode.get("activated"))) === true) {
				throw new ServerResponseError(403, t("validation.verifyChangeEmailInvalidProperties", { lng: browserLng }), {
					code: [t("validation.changeEmailCodeAlreadyUsed", { lng: browserLng })]
				});
			}

			// Throw error if code has expired based on gracePeriod
			const currentTime = new Date();
			const timeWindow = moment(currentTime).subtract(changeEmailAddressCode.get("gracePeriod"), "hour");
			if (!moment(changeEmailAddressCode.get("createdAt")).isBetween(timeWindow, currentTime)) {
				throw new ServerResponseError(403, t("validation.verifyChangeEmailInvalidProperties"), {
					code: [t("validation.changeEmailCodeExpired", { lng: browserLng }, { lng: browserLng, gracePeriod: changeEmailAddressCode.get("gracePeriod") })]
				});
			}

			// Load user based on provided values
			const user = await models().user.findOne(
				{ where: { id: changeEmailAddressCode.get("userId"), clientId: changeEmailAddressCode.get("clientId"), active: true } },
				{ transaction: transaction }
			);

			// Throw an error if the user does not exist
			if (user === null) {
				throw new ServerResponseError(403, t("validation.loadUserFailed", { lng: browserLng }), null);
			}

			// Change email address and email verified column to true
			user.update({
				emailAddress: changeEmailAddressCode.get("newEmailAddress"),
				emailVerified: true
			});

			// Update verify email code set activated to true
			changeEmailAddressCode.update({
				activated: true
			});

			// Create emailParams object
			const emailParams = {
				firstName: user.get("firstName"),
				workspaceName: client.get("workspaceURL"),
				oldEmailAddress: changeEmailAddressCode.get("oldEmailAddress"),
				newEmailAddress: user.get("emailAddress")
			};

			// Send an email to confirm the users email address has been updated
			sendEmail(EMAIL_TYPE.CHANGE_EMAIL_ADDRESS_SUCCESS, user.get("language"), user.get("emailAddress"), emailParams, user.get("clientId"), user.get("id"));

			// Return the response object
			return { status: 200, message: t("label.success", { lng: browserLng }) };
		} catch (error) {
			throw error;
		}
	});
}

// Change Language for logged in user
export function changeLanguage(requestProperties, authenticatedUser, browserLng) {
	return database().transaction(async function(transaction) {
		try {
			// Load client for authenticated user
			const client = await models().client.findOne({ where: { id: authenticatedUser.clientId, active: true } }, { transaction: transaction });

			// Throw an error if the client does not exist
			if (client === null) {
				throw new ServerResponseError(403, t("validation.loadUserPropertiesFailed", { lng: browserLng }), { client: [t("validation.loadClientFailed", { lng: browserLng })] });
			}

			// Load user properties for authenticated user
			const user = await models().user.findOne({ where: { id: authenticatedUser.userId, clientId: client.get("id"), active: true } }, { transaction: transaction });

			// Throw an error if the user does not exist
			if (user === null) {
				throw new ServerResponseError(403, t("validation.loadUserPropertiesFailed", { lng: browserLng }), { user: [t("validation.loadUserPropertiesFailed", { lng: browserLng })] });
			}

			// Store new user language in database
			const newLanguage = Object.keys(LANGUAGE_CODES).find(key => LANGUAGE_CODES[key] === requestProperties.language);

			if (user.get("language") !== newLanguage) {
				user.update({
					language: newLanguage
				});
			}

			// Create a response object
			const response = { status: 200, message: t("label.success", { lng: browserLng }), language: requestProperties.language };

			// Return the response object
			return response;
		} catch (error) {
			throw error;
		}
	});
}

// Change Password for logged in user
export function changePassword(requestProperties, authenticatedUser, browserLng) {
	return database().transaction(async function(transaction) {
		try {
			// Load client for authenticated user
			const client = await models().client.findOne({ where: { id: authenticatedUser.clientId, active: true } }, { transaction: transaction });

			// Throw an error if the client does not exist
			if (client === null) {
				throw new ServerResponseError(403, t("validation.loadUserPropertiesFailed", { lng: browserLng }), { client: [t("validation.loadClientFailed", { lng: browserLng })] });
			}

			// Load user properties for authenticated user
			const user = await models().user.findOne({ where: { id: authenticatedUser.userId, clientId: client.get("id"), active: true } }, { transaction: transaction });

			// Throw an error if the user does not exist
			if (user === null) {
				throw new ServerResponseError(403, t("validation.loadUserPropertiesFailed", { lng: browserLng }), { user: [t("validation.loadUserPropertiesFailed", { lng: browserLng })] });
			}

			// Check that the supplied password matches the one stored in database
			const valid = await bcrypt.compare(requestProperties.currentPassword, user.get("password"));
			if (valid === false) {
				throw new ServerResponseError(403, t("validation.userInvalidProperties", { lng: browserLng }), { password: [t("validation.incorrectCurrentPasswordSupplied", { lng: browserLng })] });
			}

			// Encrypt and salt user password
			const password = await bcrypt.hash(requestProperties.newPassword, 10);

			// store new password in user object
			user.update({
				password: password
			});

			// Create emailParams object
			const emailParams = {
				firstName: user.get("firstName"),
				workspaceName: client.get("workspaceURL")
			};

			// Send password reset email
			sendEmail(EMAIL_TYPE.CHANGE_PASSWORD_SUCCESS, user.get("language"), user.get("emailAddress"), emailParams, user.get("clientId"), user.get("id"));

			// Create a response object
			const response = { status: 200, message: t("label.success", { lng: browserLng }) };

			// Return the response object
			return response;
		} catch (error) {
			throw error;
		}
	});
}

// Generate a signed url for profile photo uploading
export function generateSignedProfilePhotoURL(requestProperties, authenticatedUser, browserLng) {
	return database().transaction(async function() {
		try {
			// Generate S3 presigned URL
			const url = await presignedPutObject(
				requestProperties.contentType,
				config.s3.bucket,
				SIGNED_URL_EXPIRY_TIME.CHANGE_AVATAR,
				ACL_POLICIES.PUBLIC_READ,
				authenticatedUser.clientId,
				authenticatedUser.userId
			);

			// Create a response object
			const response = { status: 200, message: t("label.success", { lng: browserLng }), key: url.key, signedURL: url.signedURL };

			// Return the response object
			return response;
		} catch (error) {
			throw error;
		}
	});
}

// Save user profile photo
export function saveUserProfilePhoto(requestProperties, authenticatedUser, browserLng) {
	return database().transaction(async function(transaction) {
		try {
			// Load client for authenticated user
			const client = await models().client.findOne({ where: { id: authenticatedUser.clientId, active: true } }, { transaction: transaction });

			// Throw an error if the client does not exist
			if (client === null) {
				throw new ServerResponseError(403, t("validation.loadUserPropertiesFailed", { lng: browserLng }), { client: [t("validation.loadClientFailed", { lng: browserLng })] });
			}

			// Load user properties for authenticated user
			const user = await models().user.findOne({ where: { id: authenticatedUser.userId, clientId: client.get("id"), active: true } }, { transaction: transaction });

			// Throw an error if the user does not exist
			if (user === null) {
				throw new ServerResponseError(403, t("validation.loadUserPropertiesFailed", { lng: browserLng }), { user: [t("validation.loadUserPropertiesFailed", { lng: browserLng })] });
			}

			// Confirm that the provided key links to an S3 bucket image
			const objectExists = await checkObjectExists(config.s3.bucket, requestProperties.key);
			if (objectExists !== true) {
				throw new ServerResponseError(403, t("validation.imageKeyInvalid", null));
			}

			// If old image exists, temporarily store the key in a variable to delete later on
			let previousProfilePhoto = null;
			if (user.get("profilePhoto") !== null) {
				previousProfilePhoto = user.get("profilePhoto");
			}

			// Store new image key in database
			await user.update({
				profilePhoto: requestProperties.key
			});

			// Finally delete the old image now that it has been replaced with the new one
			if (previousProfilePhoto !== null) {
				await deleteObject(config.s3.bucket, previousProfilePhoto);
			}

			// Create a response object
			const response = { status: 200, message: t("label.success", { lng: browserLng }) };

			// Return the response object
			return response;
		} catch (error) {
			throw error;
		}
	});
}

// Delete user profile photo
export function deleteUserProfilePhoto(requestProperties, authenticatedUser, browserLng) {
	return database().transaction(async function(transaction) {
		try {
			// Load client for authenticated user
			const client = await models().client.findOne({ where: { id: authenticatedUser.clientId, active: true } }, { transaction: transaction });

			// Throw an error if the client does not exist
			if (client === null) {
				throw new ServerResponseError(403, t("validation.loadUserPropertiesFailed", { lng: browserLng }), { client: [t("validation.loadClientFailed", { lng: browserLng })] });
			}

			// Load user properties for authenticated user
			const user = await models().user.findOne({ where: { id: authenticatedUser.userId, clientId: client.get("id"), active: true } }, { transaction: transaction });

			// Throw an error if the user does not exist
			if (user === null) {
				throw new ServerResponseError(403, t("validation.loadUserPropertiesFailed", { lng: browserLng }), { user: [t("validation.loadUserPropertiesFailed", { lng: browserLng })] });
			}

			// Delete profile photo from database
			if (user.get("profilePhoto") !== null) {
				// Temporarily store key in variable
				const imageKey = user.get("profilePhoto");

				// Remove the key from the user profile
				await user.update({
					profilePhoto: null
				});

				try {
					// Check the old image still exists in the bucket before we try to delete
					const imageExists = await checkObjectExists(config.s3.bucket, imageKey);

					if (imageExists == true) {
						// Delete image from S3 bucket using key
						await deleteObject(config.s3.bucket, imageKey);
					}
				} catch (error) {
					// Do nothing
				}
			}

			// Create a response object
			const response = { status: 200, message: t("label.success", { lng: browserLng }) };

			// Return the response object
			return response;
		} catch (error) {
			throw error;
		}
	});
}
