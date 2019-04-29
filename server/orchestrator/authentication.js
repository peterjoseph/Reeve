import bcrypt from "bcrypt";
import uniqid from "uniqid";
import moment from "moment";

import { Sequelize, database, models } from "services/sequelize";
import redis from "services/redis";
import passport from "services/passport";
import { presignedGetObject, checkObjectExists } from "services/s3";
import { sendEmail } from "services/nodemailer";
import config from "../../config";
import { variableExists, arrayContains } from "shared/utilities/filters";
import { ServerResponseError } from "utilities/errors/serverResponseError";
import { t } from "shared/translations/i18n";
import { FEATURES, SUBSCRIPTION_TYPE, ROLE_TYPE, EMAIL_TYPE, BILLING_CYCLE, LANGUAGE_CODES, SIGNED_URL_EXPIRY_TIME } from "shared/constants";

// Validate Workspace URL and retrieve client styling (if feature exists)
export function validateWorkspaceURL(requestProperties, authenticatedUser, browserLng) {
	return database().transaction(async function(transaction) {
		try {
			// Load a client using a workspaceURL
			const client = await models().client.findOne({ where: { workspaceURL: requestProperties.workspaceURL, active: true } }, { transaction: transaction });

			// Throw an error if the client was not returned for the WorkspaceURL
			if (client === null || client.get("workspaceURL") === null || client.get("workspaceURL") !== requestProperties.workspaceURL) {
				throw new ServerResponseError(403, t("validation.clientInvalidProperties", { lng: browserLng }), { workspaceURL: [t("validation.emptyWorkspaceURL", { lng: browserLng })] });
			}

			// Load list of features for client based on their subscription id
			let features = await models().subscriptionFeatures.findAll({ where: { subscriptionId: client.get("subscriptionId") } }, { transaction: transaction });

			// Map feature id's to an array
			if (features != null && features.length > 0) {
				features = features.map(result => result.get("featureId"));
			}

			// Load styling if client has styling feature
			let clientStyling = {};
			if (arrayContains(FEATURES.STYLING, features)) {
				let styling = await models().clientStyling.findOne({ where: { clientId: client.get("id") } }, { transaction: transaction });
				if (styling != null) {
					// Fetch a signed url for logo Image
					let logoImageURL = "";
					try {
						const imageKey = styling.get("logoImage");
						if (variableExists(imageKey)) {
							const url = await presignedGetObject(config.s3.bucket, imageKey, SIGNED_URL_EXPIRY_TIME.DISPLAY_CLIENT_STYLING_IMAGES);
							logoImageURL = url.signedURL;
						}
					} catch (error) {
						logoImageURL = "";
					}

					// Fetch a signed url for background image
					let backgroundImageURL = "";
					try {
						const imageKey = styling.get("backgroundImage");
						if (variableExists(imageKey)) {
							const url = await presignedGetObject(config.s3.bucket, imageKey, SIGNED_URL_EXPIRY_TIME.DISPLAY_CLIENT_STYLING_IMAGES);
							backgroundImageURL = url.signedURL;
						}
					} catch (error) {
						backgroundImageURL = "";
					}

					clientStyling = {
						logoImage: logoImageURL,
						backgroundImage: backgroundImageURL,
						backgroundColor: styling.get("backgroundColor"),
						primaryColor: styling.get("primaryColor"),
						secondaryColor: styling.get("secondaryColor")
					};
				}
			}

			// Load client default language into styling object
			clientStyling.defaultLanguage = LANGUAGE_CODES[client.get("defaultLanguage")] || "";

			// Create a response object
			const response = { status: 200, message: t("label.success", { lng: browserLng }) };

			// Append client styling to response object if exists
			if (clientStyling !== null) {
				response.style = clientStyling;
			}

			// Return the response object
			return response;
		} catch (error) {
			throw error;
		}
	});
}

// Generate user email validation code
export async function generateUserEmailValidationCode(userId, clientId, transaction) {
	// Create unique validation code for userId
	const code = uniqid();

	// Store validation code in table
	await models().emailVerificationCode.create(
		{
			verificationCode: code,
			activated: false,
			userId: userId,
			clientId: clientId,
			gracePeriod: 2
		},
		{ transaction: transaction }
	);

	return code;
}

// Register new Client
export function registerNewClient(requestProperties, authenticatedUser, browserLng) {
	return database().transaction(async function(transaction) {
		try {
			// Check if client already exists for workspaceURL
			const client = await models().client.findOne({ where: { workspaceURL: requestProperties.workspaceURL, active: true } }, { transaction: transaction });

			// Throw an error if a client already exists for a WorkspaceURL
			if (client !== null) {
				throw new ServerResponseError(403, t("validation.clientInvalidProperties", { lng: browserLng }), { workspaceURL: [t("validation.registeredWorkspaceURL", { lng: browserLng })] });
			}

			// Load active language numerical value from constants object
			const activeLanguage = Object.keys(LANGUAGE_CODES).find(key => LANGUAGE_CODES[key] === requestProperties.language);

			// Create new client object
			const clientObject = {
				name: requestProperties.workspaceURL,
				workspaceURL: requestProperties.workspaceURL,
				subscriptionId: SUBSCRIPTION_TYPE.TRIAL,
				defaultLanguage: activeLanguage
			};

			// Calculate start time of new client account
			const startDate = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");

			// Add time to clientObject
			clientObject.subscriptionStartDate = startDate;

			// If stripe enabled we need to create a trial end time
			if (config.stripe.enabled) {
				const endDate = moment(startDate, "YYYY-MM-DD HH:mm:ss").add(BILLING_CYCLE.TRIAL, "days");
				// Add subscription end date to the client object
				clientObject.subscriptionEndDate = endDate;
			}

			// Save client object to database
			const clientInstance = await models().client.create(clientObject, { transaction: transaction });

			// Encrypt and salt user password
			const password = await bcrypt.hash(requestProperties.password, 10);

			// Create new user and save to database
			const userInstance = await models().user.create(
				{
					firstName: requestProperties.firstName,
					lastName: requestProperties.lastName,
					clientId: clientInstance.get("id"),
					emailAddress: requestProperties.emailAddress,
					password: password,
					language: activeLanguage
				},
				{ transaction: transaction }
			);

			// Create new user Role object with Owner Type
			await models().userRoles.create(
				{
					userId: userInstance.get("id"),
					roleId: ROLE_TYPE.OWNER,
					active: true
				},
				{ transaction: transaction }
			);

			// Generate user email validation code
			const validationCode = await generateUserEmailValidationCode(userInstance.get("id"), clientInstance.get("id"), transaction);

			// Build email params object
			const emailParams = {
				firstName: userInstance.get("firstName"),
				workspaceName: clientInstance.get("workspaceName"),
				workspaceURL: `${config.build.protocol}://${clientInstance.get("workspaceURL")}.${config.build.domainPath}/`,
				validationLink: `${config.build.protocol}://${clientInstance.get("workspaceURL")}.${config.build.domainPath}/verify#code=${validationCode}`
			};

			// Send welcome email to user
			sendEmail(EMAIL_TYPE.CLIENT_WELCOME, userInstance.get("language"), userInstance.get("emailAddress"), emailParams, clientInstance.get("id"), userInstance.get("id"));

			// Create a response object
			const response = { status: 200, message: t("label.success", { lng: browserLng }) };

			// Return the response object
			return response;
		} catch (error) {
			throw error;
		}
	});
}

// Authenticate User with security token
export function authenticateWithJWTStrategy(req, res, next, browserLng) {
	return passport.perform().authenticate("jwt", { session: false }, function(error, user) {
		// Throw exception if loading passport strategy fails
		if (error) {
			return res
				.status(403)
				.send(new ServerResponseError(403, t("validation.tokenInvalidOrExpired", { lng: browserLng }), { token: [t("validation.tokenInvalidOrExpired", { lng: browserLng })] }));
		}
		// Authenticate user with strategy
		req.logIn(user, function(error) {
			if (error) {
				return res
					.status(403)
					.send(new ServerResponseError(403, t("validation.tokenInvalidOrExpired", { lng: browserLng }), { token: [t("validation.tokenInvalidOrExpired", { lng: browserLng })] }));
			}
			if (user) {
				database().transaction(async function(transaction) {
					try {
						// Get current server time
						const currentTime = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");

						// Load user from database
						const userObject = await models().user.findOne({ where: { id: user.userId, clientId: user.clientId, active: true } }, { transaction: transaction });

						// Throw an error if user could not be loaded from database
						if (userObject === null) {
							return res
								.status(403)
								.send(
									new ServerResponseError(403, t("validation.tokenInvalidOrExpired", { lng: browserLng }), { token: [t("validation.tokenInvalidOrExpired", { lng: browserLng })] })
								);
						}

						// Store lastLoginDate in database
						userObject.update({
							lastLoginDate: currentTime
						});
					} catch (error) {
						throw error;
					}
				});

				// Create a response object
				const response = { status: 200, message: t("label.success", { lng: browserLng }) };

				// Return the response object
				return res.status(200).send(response);
			} else {
				const errorMsg = new ServerResponseError(403, t("validation.tokenInvalidOrExpired", { lng: browserLng }), { token: [t("validation.tokenInvalidOrExpired", { lng: browserLng })] });
				return res.status(403).send(errorMsg);
			}
		});
	})(req, res, next);
}

// Authenticate using Local authentication strategy
export function authenticateWithLocalStrategy(req, res, next, browserLng) {
	return passport.perform().authenticate("local", { session: false }, function(error, user) {
		// Throw exception if loading passport strategy fails
		if (error) {
			return res
				.status(403)
				.send(new ServerResponseError(403, t("validation.userInvalidProperties", { lng: browserLng }), { emailAddress: [t("validation.incorrectLoginDetailsSupplied", { lng: browserLng })] }));
		}
		// Authenticate user with strategy
		req.logIn(user, function(error) {
			if (error) {
				return res
					.status(403)
					.send(
						new ServerResponseError(403, t("validation.userInvalidProperties", { lng: browserLng }), { emailAddress: [t("validation.incorrectLoginDetailsSupplied", { lng: browserLng })] })
					);
			}
			if (user) {
				database().transaction(async function(transaction) {
					try {
						// Get current server time
						const currentTime = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");

						// Load user from database
						const userObject = await models().user.findOne({ where: { id: user.userId, clientId: user.clientId, active: true } }, { transaction: transaction });

						// Throw an error if user could not be loaded from database
						if (userObject === null) {
							return res.status(403).send(
								new ServerResponseError(403, t("validation.userInvalidProperties", { lng: browserLng }), {
									emailAddress: [t("validation.incorrectLoginDetailsSupplied", { lng: browserLng })]
								})
							);
						}

						// Store lastLoginDate in database
						userObject.update({
							lastLoginDate: currentTime
						});
					} catch (error) {
						throw error;
					}
				});

				// Build our response object
				const response = { status: 200, message: t("label.success", { lng: browserLng }), token: user.token, keepSignedIn: req.body.keepSignedIn };

				// Return the response object
				return res.status(200).send(response);
			} else {
				const errorMsg = new ServerResponseError(403, t("validation.userInvalidProperties", { lng: browserLng }), {
					emailAddress: [t("validation.incorrectLoginDetailsSupplied", { lng: browserLng })]
				});
				return res.status(403).send(errorMsg);
			}
		});
	})(req, res, next);
}

// Delete session
export function deleteSession(requestProperties, authenticatedUser, browserLng) {
	return database().transaction(async function(transaction) {
		try {
			// Delete session from redis db
			await redis.delete(authenticatedUser.sessionId);

			// Create a response object
			return { status: 200, message: t("label.success", { lng: browserLng }) };
		} catch (error) {
			throw error;
		}
	});
}

// Load properties for a user
export function loadUserProperties(requestProperties, authenticatedUser, browserLng) {
	return database().transaction(async function(transaction) {
		try {
			// Load client for authenticated user
			const client = await models().client.findOne({ where: { id: authenticatedUser.clientId, workspaceURL: authenticatedUser.workspaceURL, active: true } }, { transaction: transaction });

			// Throw an error if the client does not exist
			if (client === null) {
				throw new ServerResponseError(403, t("validation.loadUserPropertiesFailed", { lng: browserLng }), { client: [t("validation.loadClientFailed", { lng: browserLng })] });
			}

			// Load user properties for authenticated user
			const user = await models().user.findOne({ where: { id: authenticatedUser.userId, clientId: authenticatedUser.clientId, active: true } }, { transaction: transaction });

			// Throw an error if the user does not exist
			if (user === null) {
				throw new ServerResponseError(403, t("validation.loadUserPropertiesFailed", { lng: browserLng }), { user: [t("validation.loadUserPropertiesFailed", { lng: browserLng })] });
			}

			// Load client features
			let features = await models().subscriptionFeatures.findAll({ where: { subscriptionId: client.get("subscriptionId") } }, { transaction: transaction });

			// Map feature id's to an array
			if (features === null || features.length === 0) {
				throw new ServerResponseError(403, t("validation.loadUserPropertiesFailed", { lng: browserLng }), { features: [t("validation.loadClientFeaturesFailed", { lng: browserLng })] });
			}
			features = features.map(result => result.get("featureId"));

			// Load user roles
			let roles = await models().userRoles.findAll({ where: { userId: user.get("id") } }, { transaction: transaction });

			// Map role id's to an array
			if (roles === null || roles.length === 0) {
				throw new ServerResponseError(403, t("validation.loadUserPropertiesFailed", { lng: browserLng }), { roles: [t("validation.loadUserRolesFailed", { lng: browserLng })] });
			}
			roles = roles.map(result => result.get("roleId"));

			// Create server login time
			const time = moment(new Date());

			// Determine if client subscription is active
			let subscriptionActive = true;
			if (config.stripe.enabled) {
				if (client.get("subscriptionEndDate") !== null) {
					if (moment(client.get("subscriptionEndDate")).diff(time, "minutes") <= 0) {
						subscriptionActive = false;
					}
				}
			}

			// Fetch a signed url with profile photo (if exists)
			let profilePhoto = null;
			try {
				const imageKey = user.get("profilePhoto");
				if (variableExists(imageKey)) {
					const imageExists = await checkObjectExists(config.s3.bucket, imageKey);
					if (imageExists == true) {
						const url = await presignedGetObject(config.s3.bucket, imageKey, SIGNED_URL_EXPIRY_TIME.DISPLAY_AVATAR);
						profilePhoto = url.signedURL;
					}
				}
			} catch (error) {
				profilePhoto = null;
			}

			// Create user properties object to be returned back to the front-end
			let userProperties = {
				loginTime: time,
				userId: user.get("id"),
				firstName: user.get("firstName"),
				lastName: user.get("lastName"),
				profilePhoto: profilePhoto,
				emailAddress: user.get("emailAddress"),
				emailVerified: Boolean(Number(user.get("emailVerified"))),
				clientName: client.get("name"),
				workspaceURL: client.get("workspaceURL"),
				subscriptionId: client.get("subscriptionId"),
				subscriptionStartDate: client.get("subscriptionStartDate"),
				subscriptionEndDate: client.get("subscriptionEndDate"),
				subscriptionActive: subscriptionActive,
				billingCycle: client.get("billingCycle"),
				clientFeatures: features,
				userRoles: roles,
				language: LANGUAGE_CODES[user.get("language")] || ""
			};

			// Append styling if client has styling feature enabled
			if (arrayContains(FEATURES.STYLING, features)) {
				let styling = await models().clientStyling.findOne({ where: { clientId: client.get("id") } }, { transaction: transaction });
				if (styling != null) {
					// Fetch a signed url for logo Image
					let logoImageURL = "";
					try {
						const imageKey = styling.get("logoImage");
						if (variableExists(imageKey)) {
							const url = await presignedGetObject(config.s3.bucket, imageKey, SIGNED_URL_EXPIRY_TIME.DISPLAY_CLIENT_STYLING_IMAGES);
							logoImageURL = url.signedURL;
						}
					} catch (error) {
						logoImageURL = "";
					}

					// Fetch a signed url for background image
					let backgroundImageURL = "";
					try {
						const imageKey = styling.get("backgroundImage");
						if (variableExists(imageKey)) {
							const url = await presignedGetObject(config.s3.bucket, imageKey, SIGNED_URL_EXPIRY_TIME.DISPLAY_CLIENT_STYLING_IMAGES);
							backgroundImageURL = url.signedURL;
						}
					} catch (error) {
						backgroundImageURL = "";
					}

					// Create user properties object including client styling
					userProperties = {
						...userProperties,
						logoImage: logoImageURL,
						backgroundImage: backgroundImageURL,
						backgroundColor: styling.get("backgroundColor"),
						primaryColor: styling.get("primaryColor"),
						secondaryColor: styling.get("secondaryColor")
					};
				}
			}

			// Build our response object
			const response = { status: 200, message: t("label.success", { lng: browserLng }), user: userProperties };

			// Return the response object
			return response;
		} catch (error) {
			throw error;
		}
	});
}

// Resend verification email for validating email addresses
export function resendVerifyEmail(requestProperties, authenticatedUser, browserLng) {
	return database().transaction(async function(transaction) {
		try {
			if (authenticatedUser.userId === null || !Number.isInteger(authenticatedUser.userId)) {
				throw new ServerResponseError(403, t("validation.invalidUserId", { lng: browserLng }), null);
			}

			// Load user and check if email has already been verified
			const user = await models().user.findOne({ where: { id: authenticatedUser.userId, clientId: authenticatedUser.clientId, active: true } }, { transaction: transaction });
			if (!user || Boolean(Number(user.get("emailVerified"))) === true) {
				throw new ServerResponseError(403, t("validation.invalidUserId", { lng: browserLng }), null); // Email already verified response
			}

			// Load client object
			const client = await models().client.findOne({ where: { id: authenticatedUser.clientId, active: true } }, { transaction: transaction });

			// Check email table for last email sent
			const currentTime = new Date();
			const Op = Sequelize.Op;
			const lastEmail = await models().sentEmails.findAll(
				{
					where: {
						clientId: authenticatedUser.clientId,
						userId: authenticatedUser.userId,
						emailType: EMAIL_TYPE.CLIENT_WELCOME,
						createdAt: {
							[Op.between]: [
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

			// If no verify email message was sent in the last 5 minutes, send a new email
			if (lastEmail === null || lastEmail.length === 0) {
				// Create unique validation code for userId
				const validationCode = uniqid();

				// Store validation code in table
				await models().emailVerificationCode.create(
					{
						verificationCode: validationCode,
						activated: false,
						userId: authenticatedUser.userId,
						clientId: authenticatedUser.clientId,
						gracePeriod: 2
					},
					{ transaction: transaction }
				);

				// Build email params object
				const emailParams = {
					firstName: user.get("firstName"),
					validationLink: `${config.build.protocol}://${client.get("workspaceURL")}.${config.build.domainPath}/verify#code=${validationCode}`
				};

				// Send welcome email to user
				sendEmail(EMAIL_TYPE.RESEND_VERIFY_EMAIL, user.get("language"), user.get("emailAddress"), emailParams, authenticatedUser.clientId, user.get("id"));
			}

			// Create a response object
			return { status: 200, message: t("label.success", { lng: browserLng }) };
		} catch (error) {
			throw error;
		}
	});
}

// Send email with password reset if user forgot their password but workspace name is provided
export function forgotAccountPasswordEmail(requestProperties, authenticatedUser, browserLng) {
	return database().transaction(async function(transaction) {
		try {
			// Load client object associated with the workspace name
			const client = await models().client.findOne({ where: { workspaceURL: requestProperties.workspaceURL, active: true } }, { transaction: transaction });

			// Load generic forgot account details page
			if (client === null) {
				return forgotAccountEmail(requestProperties, null, browserLng);
			}

			// Check if email sent in the last 5 minutes
			const currentTime = new Date();
			const lastEmail = await models().sentEmails.findAll(
				{
					where: {
						to: requestProperties.emailAddress,
						emailType: EMAIL_TYPE.FORGOT_PASSWORD,
						createdAt: {
							[Sequelize.Op.between]: [
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

			// Continue if no emails of type FORGOT_PASSWORD sent in the last 5 minutes
			if (lastEmail === null || lastEmail.length === 0) {
				// Load user account associated with the email address and workspace url
				const user = await models().user.findOne({ where: { emailAddress: requestProperties.emailAddress, clientId: client.get("id"), active: true } }, { transaction: transaction });

				// Return success if no users associated with the email, or no accounts active
				if (user === null) {
					return { status: 200, message: t("label.success", { lng: browserLng }) };
				}

				// Generate password reset code for each account
				const resetCode = uniqid();

				// Store validation code in table
				await models().passwordReset.create(
					{
						resetCode: resetCode,
						activated: false,
						userId: user.get("id"),
						clientId: user.get("clientId"),
						gracePeriod: 2
					},
					{ transaction: transaction }
				);

				// Create emailParams object
				const emailParams = {
					firstName: user.get("firstName"),
					lastName: user.get("lastName"),
					clientName: client.get("name"),
					resetPasswordLink: `${config.build.protocol}://${client.get("workspaceURL")}.${config.build.domainPath}/reset#code=${resetCode}`
				};

				// Send forgot account details
				sendEmail(EMAIL_TYPE.FORGOT_PASSWORD, user.get("language"), requestProperties.emailAddress, emailParams, user.get("clientId"), user.get("id"));
			}

			// Create a response object
			return { status: 200, message: t("label.success", { lng: browserLng }) };
		} catch (error) {
			throw error;
		}
	});
}

// Send email with account details if user forgot their account or workspace url
export function forgotAccountEmail(requestProperties, authenticatedUser, browserLng) {
	return database().transaction(async function(transaction) {
		try {
			// Check if email sent in the last 5 minutes
			const currentTime = new Date();
			const lastEmail = await models().sentEmails.findAll(
				{
					where: {
						to: requestProperties.emailAddress,
						emailType: EMAIL_TYPE.FORGOT_ACCOUNT_DETAILS,
						createdAt: {
							[Sequelize.Op.between]: [
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

			// Continue if no emails of type FORGOT_ACCOUNT_DETAILS sent in the last 5 minutes
			if (lastEmail === null || lastEmail.length === 0) {
				// Load list of all active user accounts associated with the email address
				const users = await models().user.findAll({ where: { emailAddress: requestProperties.emailAddress, active: true } }, { transaction: transaction });

				// Return success if no users associated with the email, or no accounts active
				if (users === null || users.length === 0) {
					return { status: 200, message: t("label.success", { lng: browserLng }) };
				}

				// Create account array to be used in the email template
				let accounts = [];

				// Iterate over user list and add to array
				for (const user of users) {
					// Load client object
					const client = await models().client.findOne({ where: { id: user.get("clientId"), active: true } }, { transaction: transaction });

					// Check if client is active for the user
					if (client == null) {
						return;
					}

					// Generate password reset code for each account
					const resetCode = uniqid();

					// Store validation code in table
					await models().passwordReset.create(
						{
							resetCode: resetCode,
							activated: false,
							userId: user.get("id"),
							clientId: user.get("clientId"),
							gracePeriod: 1
						},
						{ transaction: transaction }
					);

					const account = {
						firstName: user.get("firstName"),
						lastName: user.get("lastName"),
						clientName: client.get("name"),
						workspaceLink: `${config.build.protocol}://${client.get("workspaceURL")}.${config.build.domainPath}/`,
						resetPasswordLink: `${config.build.protocol}://${client.get("workspaceURL")}.${config.build.domainPath}/reset#code=${resetCode}`
					};

					// Add account object to accounts array
					accounts.push(account);
				}

				// Create emailParams object
				const emailParams = {
					accounts: accounts
				};

				// Send forgot account details
				sendEmail(EMAIL_TYPE.FORGOT_ACCOUNT_DETAILS, users[0].get("language"), requestProperties.emailAddress, emailParams, null, null);
			}

			// Create a response object
			return { status: 200, message: t("label.success", { lng: browserLng }) };
		} catch (error) {
			throw error;
		}
	});
}

// Validate the reset code used to reset passwords
export function validateResetPasswordCode(requestProperties, authenticatedUser, browserLng) {
	return database().transaction(async function(transaction) {
		try {
			// Load client from workspace url
			const client = await models().client.findOne({ where: { workspaceURL: requestProperties.workspaceURL, active: true } }, { transaction: transaction });

			// Throw an error if the client does not exist
			if (client === null) {
				throw new ServerResponseError(403, t("validation.resetPasswordInvalidProperties", { lng: browserLng }), { client: [t("validation.loadClientFailed", { lng: browserLng })] });
			}

			// Check if reset code exists and is valid
			const reset = await models().passwordReset.findOne(
				{
					where: {
						resetCode: requestProperties.code,
						clientId: client.get("id")
					}
				},
				{ transaction: transaction }
			);

			// Throw error if code could not be found
			if (reset === null) {
				throw new ServerResponseError(403, t("validation.resetPasswordInvalidProperties", { lng: browserLng }), { code: [t("validation.emptyResetCode", { lng: browserLng })] });
			}

			// Confirm different states of the reset code
			if (Boolean(Number(reset.get("activated"))) === true) {
				throw new ServerResponseError(403, t("validation.resetPasswordInvalidProperties"), { code: [t("validation.resetCodeAlreadyUsed")] });
			}

			// Throw error if code has expired based on gracePeriod
			const currentTime = new Date();

			const timeWindow = moment(currentTime).subtract(reset.get("gracePeriod"), "hour");

			if (!moment(reset.get("createdAt")).isBetween(timeWindow, currentTime)) {
				throw new ServerResponseError(403, t("validation.resetPasswordInvalidProperties", { lng: browserLng }), {
					code: [t("validation.resetCodeExpired", { gracePeriod: reset.get("gracePeriod", { lng: browserLng }) })]
				});
			}

			// Return the response object
			return { status: 200, message: t("label.success", { lng: browserLng }) };
		} catch (error) {
			throw error;
		}
	});
}

// Reset user password
export function resetUserPassword(requestProperties, authenticatedUser, browserLng) {
	return database().transaction(async function(transaction) {
		try {
			// Load client from workspace url
			const client = await models().client.findOne({ where: { workspaceURL: requestProperties.workspaceURL, active: true } }, { transaction: transaction });

			// Throw an error if the client does not exist
			if (client === null) {
				throw new ServerResponseError(403, t("validation.resetPasswordInvalidProperties", { lng: browserLng }), { client: [t("validation.loadClientFailed", { lng: browserLng })] });
			}

			// Check if reset code exists and is valid
			const reset = await models().passwordReset.findOne(
				{
					where: {
						resetCode: requestProperties.code,
						clientId: client.get("id")
					}
				},
				{ transaction: transaction }
			);

			// Throw error if code could not be found
			if (reset === null) {
				throw new ServerResponseError(403, t("validation.resetPasswordInvalidProperties", { lng: browserLng }), { code: [t("validation.emptyResetCode", { lng: browserLng })] });
			}

			// Confirm different states of the reset code
			if (Boolean(Number(reset.get("activated"))) === true) {
				throw new ServerResponseError(403, t("validation.resetPasswordInvalidProperties", { lng: browserLng }), { code: [t("validation.resetCodeAlreadyUsed", { lng: browserLng })] });
			}

			// Throw error if code has expired based on gracePeriod
			const currentTime = new Date();

			const timeWindow = moment(currentTime).subtract(reset.get("gracePeriod"), "hour");

			if (!moment(reset.get("createdAt")).isBetween(timeWindow, currentTime)) {
				throw new ServerResponseError(403, t("validation.resetPasswordInvalidProperties", { lng: browserLng }), {
					code: [t("validation.resetCodeExpired", { lng: browserLng, gracePeriod: reset.get("gracePeriod") })]
				});
			}

			// Load user based on provided values
			const user = await models().user.findOne({ where: { id: reset.get("userId"), clientId: reset.get("clientId"), active: true } }, { transaction: transaction });

			// Throw an error if the user does not exist
			if (user === null) {
				throw new ServerResponseError(403, t("validation.loadUserFailed", { lng: browserLng }), null);
			}

			// Encrypt user password
			const password = await bcrypt.hash(requestProperties.password, 10);

			// store new password in user object
			user.update({
				password: password
			});

			// Update password reset code set activated to true
			reset.update({
				activated: true
			});

			// Create emailParams object
			const emailParams = {
				firstName: user.get("firstName"),
				workspaceName: client.get("workspaceURL")
			};

			// Send password reset email
			sendEmail(EMAIL_TYPE.RESET_PASSWORD_SUCCESS, user.get("language"), user.get("emailAddress"), emailParams, user.get("clientId"), user.get("id"));

			// Return the response object
			return { status: 200, message: t("label.success", { lng: browserLng }) };
		} catch (error) {
			throw error;
		}
	});
}

// Verify User Email
export function verifyUserEmail(requestProperties, authenticatedUser, browserLng) {
	return database().transaction(async function(transaction) {
		try {
			// Load client from workspace url
			const client = await models().client.findOne({ where: { workspaceURL: requestProperties.workspaceURL, active: true } }, { transaction: transaction });

			// Throw an error if the client does not exist
			if (client === null) {
				throw new ServerResponseError(403, t("validation.verifyEmailInvalidProperties", { lng: browserLng }), { client: [t("validation.loadClientFailed", { lng: browserLng })] });
			}

			// Determine values to use in fetching the email verification code
			const where = {
				verificationCode: requestProperties.code
			};
			if (variableExists(requestProperties.userId)) {
				where.userId = requestProperties.userId;
			}

			// Check if email verification code is valid
			const emailVerificationCode = await models().emailVerificationCode.findOne({ where: where }, { transaction: transaction });

			// Throw error if code could not be found
			if (emailVerificationCode === null) {
				throw new ServerResponseError(403, t("validation.verifyEmailInvalidProperties", { lng: browserLng }), { code: [t("validation.emptyVerifyCode", { lng: browserLng })] });
			}

			// Confirm different states of the verify email code
			if (Boolean(Number(emailVerificationCode.get("activated"))) === true) {
				throw new ServerResponseError(403, t("validation.verifyEmailInvalidProperties", { lng: browserLng }), { code: [t("validation.verifyCodeAlreadyUsed", { lng: browserLng })] });
			}

			// Throw error if code has expired based on gracePeriod
			const currentTime = new Date();
			const timeWindow = moment(currentTime).subtract(emailVerificationCode.get("gracePeriod"), "hour");
			if (!moment(emailVerificationCode.get("createdAt")).isBetween(timeWindow, currentTime)) {
				throw new ServerResponseError(403, t("validation.verifyEmailInvalidProperties"), {
					code: [t("validation.verifyCodeExpired", { lng: browserLng }, { lng: browserLng, gracePeriod: emailVerificationCode.get("gracePeriod") })]
				});
			}

			// Load user based on provided values
			const user = await models().user.findOne(
				{ where: { id: emailVerificationCode.get("userId"), clientId: emailVerificationCode.get("clientId"), active: true } },
				{ transaction: transaction }
			);

			// Throw an error if the user does not exist
			if (user === null) {
				throw new ServerResponseError(403, t("validation.loadUserFailed", { lng: browserLng }), null);
			}

			// Throw an error if the email has already been verified
			if (Boolean(Number(user.get("emailVerified"))) === true) {
				throw new ServerResponseError(403, t("validation.emailAlreadyVerified", { lng: browserLng }), null);
			}

			// Change email verified column to true
			user.update({
				emailVerified: true
			});

			// Update verify email code set activated to true
			emailVerificationCode.update({
				activated: true
			});

			// Return the response object
			return { status: 200, message: t("label.success", { lng: browserLng }) };
		} catch (error) {
			throw error;
		}
	});
}
