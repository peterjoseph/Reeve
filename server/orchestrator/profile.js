import bcrypt from "bcrypt";
import uniqid from "uniqid";
import moment from "moment";

import config from "../../config";

import { database, models } from "services/sequelize";
import { sendEmail } from "services/nodemailer";

import { variableExists } from "shared/utilities/filters";
import { t } from "shared/translations/i18n";
import { EMAIL_TYPE, LANGUAGE_CODES } from "shared/constants";
import { ServerResponseError } from "utilities/errors/serverResponseError";

// Load user profile
export function loadProfile(options, browserLng) {
	return database().transaction(async function(transaction) {
		try {
			// Load client for authenticated user
			const client = await models().client.findOne({ where: { id: options.clientId, active: true } }, { transaction: transaction });

			// Throw an error if the client does not exist
			if (client === null) {
				throw new ServerResponseError(403, t("validation.loadUserPropertiesFailed", { lng: browserLng }), { client: [t("validation.loadClientFailed", { lng: browserLng })] });
			}

			// Load user properties for authenticated user
			const user = await models().user.findOne({ where: { id: options.userId, clientId: client.get("id"), active: true } }, { transaction: transaction });

			// Throw an error if the user does not exist
			if (user === null) {
				throw new ServerResponseError(403, t("validation.loadUserPropertiesFailed", { lng: browserLng }), { user: [t("validation.loadUserPropertiesFailed", { lng: browserLng })] });
			}

			// Create user properties object to be returned back to the front-end
			let userProperties = {
				userId: user.get("id"),
				firstName: user.get("firstName"),
				lastName: user.get("lastName"),
				profilePhoto: user.get("profilePhoto"),
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
export function updateProfile(options, browserLng) {
	return database().transaction(async function(transaction) {
		try {
			// Load client for authenticated user
			const client = await models().client.findOne({ where: { id: options.clientId, active: true } }, { transaction: transaction });

			// Throw an error if the client does not exist
			if (client === null) {
				throw new ServerResponseError(403, t("validation.loadUserPropertiesFailed", { lng: browserLng }), { client: [t("validation.loadClientFailed", { lng: browserLng })] });
			}

			// Load user properties for authenticated user
			const user = await models().user.findOne({ where: { id: options.userId, clientId: client.get("id"), active: true } }, { transaction: transaction });

			// Throw an error if the user does not exist
			if (user === null) {
				throw new ServerResponseError(403, t("validation.loadUserPropertiesFailed", { lng: browserLng }), { user: [t("validation.loadUserPropertiesFailed", { lng: browserLng })] });
			}

			const updateParams = {
				firstName: options.firstName,
				lastName: options.lastName,
				bio: options.bio,
				location: options.location,
				website: options.website
			};

			// Send verification email if user is attempting to change email address
			if (options.emailAddress !== user.get("emailAddress")) {
				// Check if email of type CHANGE_EMAIL_ADDRESS sent in the last 5 minutes
				const currentTime = new Date();
				const lastEmail = await models().sentEmails.findAll(
					{
						where: {
							to: options.emailAddress,
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
							newEmailAddress: options.emailAddress
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
					sendEmail(EMAIL_TYPE.CHANGE_EMAIL_ADDRESS, user.get("language"), options.emailAddress, emailParams, user.get("clientId"), user.get("id"));
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
export function verifyUserEmailChange(received, browserLng) {
	return database().transaction(async function(transaction) {
		try {
			// Load client from workspace url
			const client = await models().client.findOne({ where: { workspaceURL: received.workspaceURL, active: true } }, { transaction: transaction });

			// Throw an error if the client does not exist
			if (client === null) {
				throw new ServerResponseError(403, t("validation.verifyChangeEmailInvalidProperties", { lng: browserLng }), { client: [t("validation.loadClientFailed", { lng: browserLng })] });
			}

			// Determine values to use in fetching the email verification code
			const where = {
				emailCode: received.code
			};

			if (variableExists(received.userId)) {
				where.userId = received.userId;
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
				newEmailAddress: user.get("emailAddress"),
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
export function changeLanguage(options, browserLng) {
	return database().transaction(async function(transaction) {
		try {
			// Load client for authenticated user
			const client = await models().client.findOne({ where: { id: options.clientId, active: true } }, { transaction: transaction });

			// Throw an error if the client does not exist
			if (client === null) {
				throw new ServerResponseError(403, t("validation.loadUserPropertiesFailed", { lng: browserLng }), { client: [t("validation.loadClientFailed", { lng: browserLng })] });
			}

			// Load user properties for authenticated user
			const user = await models().user.findOne({ where: { id: options.userId, clientId: client.get("id"), active: true } }, { transaction: transaction });

			// Throw an error if the user does not exist
			if (user === null) {
				throw new ServerResponseError(403, t("validation.loadUserPropertiesFailed", { lng: browserLng }), { user: [t("validation.loadUserPropertiesFailed", { lng: browserLng })] });
			}

			// Store new user language in database
			const newLanguage = Object.keys(LANGUAGE_CODES).find(key => LANGUAGE_CODES[key] === options.language);

			if (user.get("language") !== newLanguage) {
				user.update({
					language: newLanguage
				});
			}

			// Create a response object
			const response = { status: 200, message: t("label.success", { lng: browserLng }), language: options.language };

			// Return the response object
			return response;
		} catch (error) {
			throw error;
		}
	});
}

// Change Password for logged in user
export function changePassword(options, browserLng) {
	return database().transaction(async function(transaction) {
		try {
			// Load client for authenticated user
			const client = await models().client.findOne({ where: { id: options.clientId, active: true } }, { transaction: transaction });

			// Throw an error if the client does not exist
			if (client === null) {
				throw new ServerResponseError(403, t("validation.loadUserPropertiesFailed", { lng: browserLng }), { client: [t("validation.loadClientFailed", { lng: browserLng })] });
			}

			// Load user properties for authenticated user
			const user = await models().user.findOne({ where: { id: options.userId, clientId: client.get("id"), active: true } }, { transaction: transaction });

			// Throw an error if the user does not exist
			if (user === null) {
				throw new ServerResponseError(403, t("validation.loadUserPropertiesFailed", { lng: browserLng }), { user: [t("validation.loadUserPropertiesFailed", { lng: browserLng })] });
			}

			// Check that the supplied password matches the one stored in database
			const valid = await bcrypt.compare(options.currentPassword, user.get("password"));
			if (valid === false) {
				throw new ServerResponseError(403, t("validation.userInvalidProperties", { lng: browserLng }), { password: [t("validation.incorrectCurrentPasswordSupplied", { lng: browserLng })] });
			}

			// Encrypt and salt user password
			const password = await bcrypt.hash(options.newPassword, 10);

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
