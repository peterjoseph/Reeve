import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import uniqid from "uniqid";
import moment from "moment";

import { database, models } from "services/sequelize";
import passport from "services/passport";
import { sendEmail } from "services/nodemailer";
import config from "../../config";
import { arrayContains } from "shared/utilities/filters";
import { ServerResponseError } from "utilities/errors/serverResponseError";
import { t } from "shared/translations/i18n";
import { FEATURES, SUBSCRIPTION_TYPE, ROLE_TYPE, EMAIL_TYPE, SERVER_DETAILS } from "shared/constants";

// Validate Workspace URL and retrieve client styling (if feature exists)
export function validateWorkspaceURL(workspaceURL) {
	return database().transaction(async function(transaction) {
		try {
			// Load a client using a workspaceURL
			const client = await models().client.findOne({ where: { workspaceURL: workspaceURL, active: true } }, { transaction: transaction });

			// Throw an error if the client was not returned for the WorkspaceURL
			if (client === null || client.get("workspaceURL") === null || client.get("workspaceURL") !== workspaceURL) {
				throw new ServerResponseError(403, t("validation.clientInvalidProperties"), { workspaceURL: [t("validation.emptyWorkspaceURL")] });
			}

			// Load list of features for client based on their subscription id
			let features = await models().subscriptionFeatures.findAll({ where: { subscriptionId: client.get("subscriptionId") } }, { transaction: transaction });

			// Map feature id's to an array
			if (features != null && features.length > 0) {
				features = features.map(result => result.get("featureId"));
			}

			// Load styling if client has styling feature
			let clientStyling = null;
			if (arrayContains(FEATURES.STYLING, features)) {
				let styling = await models().clientStyling.findOne({ where: { clientId: client.get("id") } }, { transaction: transaction });
				if (styling != null) {
					clientStyling = {
						logoImage: styling.get("logoImage"),
						backgroundImage: styling.get("backgroundImage"),
						backgroundColor: styling.get("backgroundColor"),
						primaryColor: styling.get("primaryColor"),
						secondaryColor: styling.get("secondaryColor")
					};
				}
			}

			// Create a response object
			const response = { status: 200, message: t("label.success") };

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
export function registerNewClient(received) {
	return database().transaction(async function(transaction) {
		try {
			// Check if client already exists for workspaceURL
			const client = await models().client.findOne({ where: { workspaceURL: received.workspaceURL, active: true } }, { transaction: transaction });

			// Throw an error if a client already exists for a WorkspaceURL
			if (client !== null) {
				throw new ServerResponseError(403, t("validation.clientInvalidProperties"), { workspaceURL: [t("validation.validWorkspaceURL")] });
			}

			// Create new client and save to database
			const clientInstance = await models().client.create(
				{
					name: received.workspaceURL,
					workspaceURL: received.workspaceURL,
					subscriptionId: SUBSCRIPTION_TYPE.TRIAL
				},
				{ transaction: transaction }
			);

			// Encrypt and salt user password
			const password = bcrypt.hashSync(received.password, 10);

			// Create new user and save to database
			const userInstance = await models().user.create(
				{
					firstName: received.firstName,
					lastName: received.lastName,
					clientId: clientInstance.get("id"),
					emailAddress: received.emailAddress,
					password: password
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
				workspaceURL: `${SERVER_DETAILS.PROTOCOL}://${clientInstance.get("workspaceURL")}.${SERVER_DETAILS.DOMAIN}`,
				validationLink: `${SERVER_DETAILS.PROTOCOL}://${clientInstance.get("workspaceURL")}.${SERVER_DETAILS.DOMAIN}/verify?code=${validationCode}`
			};

			// Send welcome email to user
			sendEmail(EMAIL_TYPE.CLIENT_WELCOME, userInstance.get("language"), userInstance.get("emailAddress"), emailParams, clientInstance.get("id"), userInstance.get("id"));

			// Create a response object
			const response = { status: 200, message: t("label.success") };

			// Return the response object
			return response;
		} catch (error) {
			throw error;
		}
	});
}

// Authenticate User with security token
export function authenticateWithToken(req, res, next) {
	return passport.perform().authenticate("jwt", function(error, user) {
		if (error) {
			return next(error);
		}
		req.logIn(user, function(error) {
			if (error) {
				return next(error);
			}
			if (user) {
				// Create a response object
				const response = { status: 200, message: t("label.success") };
				// Return the response object
				return res.status(200).send(response);
			} else {
				const errorMsg = new ServerResponseError(403, t("validation.tokenInvalidOrExpired"), { token: [t("validation.tokenInvalidOrExpired")] });
				return next(errorMsg);
			}
		});
	})(req, res, next);
}

export function authenticateWithoutToken(received) {
	return database().transaction(async function(transaction) {
		try {
			// Load a client using a workspaceURL
			const client = await models().client.findOne({ where: { workspaceURL: received.workspaceURL, active: true } }, { transaction: transaction });

			// Throw an error if the client was not returned for the WorkspaceURL
			if (client === null || client.get("workspaceURL") === null || client.get("workspaceURL") !== received.workspaceURL) {
				throw new ServerResponseError(403, t("validation.userInvalidProperties"), { workspaceURL: [t("validation.emptyWorkspaceURL")] });
			}

			// Load user based on provided values
			const user = await models().user.findOne({ where: { clientId: client.get("id"), emailAddress: received.emailAddress, active: true } }, { transaction: transaction });

			// Throw an error if the user does not exist
			if (user === null) {
				throw new ServerResponseError(403, t("validation.userInvalidProperties"), { emailAddress: [t("validation.userDoesNotExist")] });
			}

			// Validate the supplied user password
			const valid = bcrypt.compareSync(received.password, user.get("password"));
			if (valid === false) {
				throw new ServerResponseError(403, t("validation.userInvalidProperties"), { password: [t("validation.invalidPasswordSupplied")] });
			}

			// Create the JSON Web Token for the User
			const token = jwt.sign({ userId: user.get("id"), clientId: client.get("id"), workspaceURL: client.get("workspaceURL") }, config.authentication.jwtSecret, {
				expiresIn: config.authentication.expiry
			});

			// Build our response object
			const response = { status: 200, message: t("label.success"), token: token, keepSignedIn: received.keepSignedIn };

			// Return the response object
			return response;
		} catch (error) {
			throw error;
		}
	});
}

// Load properties for a user
export function loadUser(received) {
	return database().transaction(async function(transaction) {
		try {
			// Load client for authenticated user
			const client = await models().client.findOne({ where: { id: received.clientId, workspaceURL: received.workspaceURL, active: true } }, { transaction: transaction });

			// Throw an error if the client does not exist
			if (client === null) {
				throw new ServerResponseError(403, t("validation.loadUserPropertiesFailed"), { client: [t("validation.loadClientFailed")] });
			}

			// Load user properties for authenticated user
			const user = await models().user.findOne({ where: { id: received.userId, clientId: received.clientId, active: true } }, { transaction: transaction });

			// Throw an error if the user does not exist
			if (user === null) {
				throw new ServerResponseError(403, t("validation.loadUserPropertiesFailed"), { user: [t("validation.loadUserPropertiesFailed")] });
			}

			// Load client features
			let features = await models().subscriptionFeatures.findAll({ where: { subscriptionId: client.get("subscriptionId") } }, { transaction: transaction });

			// Map feature id's to an array
			if (features === null || features.length === 0) {
				throw new ServerResponseError(403, t("validation.loadUserPropertiesFailed"), { features: [t("validation.loadClientFeaturesFailed")] });
			}
			features = features.map(result => result.get("featureId"));

			// Load user roles
			let roles = await models().userRoles.findAll({ where: { userId: user.get("id") } }, { transaction: transaction });

			// Map role id's to an array
			if (roles === null || roles.length === 0) {
				throw new ServerResponseError(403, t("validation.loadUserPropertiesFailed"), { roles: [t("validation.loadUserRolesFailed")] });
			}
			roles = roles.map(result => result.get("roleId"));

			// Create user properties object to be returned back to the front-end
			const userProperties = {
				userId: user.get("id"),
				firstName: user.get("firstName"),
				lastName: user.get("lastName"),
				emailAddress: user.get("emailAddress"),
				emailVerified: Boolean(Number(user.get("emailVerified"))),
				clientName: client.get("name"),
				workspaceURL: client.get("workspaceURL"),
				subscriptionId: client.get("subscriptionId"),
				subscriptionStartDate: client.get("subscriptionStartDate"),
				subscriptionEndDate: client.get("subscriptionEndDate"),
				billingCycle: client.get("billingCycle"),
				clientFeatures: features,
				userRoles: roles
			};

			// Build our response object
			const response = { status: 200, message: t("label.success"), user: userProperties };

			// Return the response object
			return response;
		} catch (error) {
			throw error;
		}
	});
}

// Resend verification email for validating email addresses
export function resendVerifyEmail(userId, clientId) {
	return database().transaction(async function(transaction) {
		try {
			if (userId === null || !Number.isInteger(userId)) {
				throw new ServerResponseError(403, t("validation.invalidUserId"), null);
			}

			// Load user and check if email has already been verified
			const user = await models().user.findOne({ where: { id: userId, clientId: clientId, active: true } }, { transaction: transaction });
			if (!user || Boolean(Number(user.get("emailVerified"))) === true) {
				throw new ServerResponseError(403, t("validation.invalidUserId"), null); // Email already verified response
			}

			// Load client object
			const client = await models().client.findOne({ where: { id: clientId, active: true } }, { transaction: transaction });

			// Check email table for last email sent
			const currentTime = new Date();
			const Op = database().Op;
			const lastEmail = await models().sentEmails.findAll(
				{
					where: {
						clientId: clientId,
						userId: userId,
						emailType: EMAIL_TYPE.CLIENT_WELCOME,
						createdAt: {
							[Op.between]: [
								// Find all emails of type sent in last 5 minutes
								moment(currentTime)
									.utc()
									.subtract(5, "minutes")
									.format("YYYY-MM-DD HH:mm:ss"),
								moment(currentTime)
									.utc()
									.format("YYYY-MM-DD HH:mm:ss")
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
						userId: userId,
						clientId: clientId,
						gracePeriod: 2
					},
					{ transaction: transaction }
				);

				// Build email params object
				const emailParams = {
					firstName: user.get("firstName"),
					validationLink: `${SERVER_DETAILS.PROTOCOL}://${client.get("workspaceURL")}.${SERVER_DETAILS.DOMAIN}/verify?code=${validationCode}`
				};

				// Send welcome email to user
				sendEmail(EMAIL_TYPE.RESEND_VERIFY_EMAIL, user.get("language"), user.get("emailAddress"), emailParams, clientId, user.get("id"));
			}

			// Create a response object
			return { status: 200, message: t("label.success") };
		} catch (error) {
			throw error;
		}
	});
}

// Send email with password reset if user forgot their password but workspace name is provided
export function forgotAccountPasswordEmail(received) {
	return database().transaction(async function(transaction) {
		try {
			// Load client object associated with the workspace name
			const client = await models().client.findOne({ where: { workspaceURL: received.workspaceURL, active: true } }, { transaction: transaction });

			// Load generic forgot account details page
			if (client === null) {
				return forgotAccountEmail(received);
			}

			// Check if email sent in the last 5 minutes
			const currentTime = new Date();
			const lastEmail = await models().sentEmails.findAll(
				{
					where: {
						to: received.emailAddress,
						emailType: EMAIL_TYPE.FORGOT_PASSWORD,
						createdAt: {
							[database().Op.between]: [
								// Find all emails of type sent in last 5 minutes
								moment(currentTime)
									.utc()
									.subtract(5, "minutes")
									.format("YYYY-MM-DD HH:mm:ss"),
								moment(currentTime)
									.utc()
									.format("YYYY-MM-DD HH:mm:ss")
							]
						}
					}
				},
				{ transaction: transaction }
			);

			// Continue if no emails of type FORGOT_PASSWORD sent in the last 5 minutes
			if (lastEmail === null || lastEmail.length === 0) {
				// Load user account associated with the email address and workspace url
				const user = await models().user.findOne({ where: { emailAddress: received.emailAddress, clientId: client.get("id"), active: true } }, { transaction: transaction });

				// Return success if no users associated with the email, or no accounts active
				if (user === null) {
					return { status: 200, message: t("label.success") };
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
					resetPasswordLink: `${SERVER_DETAILS.PROTOCOL}://${client.get("workspaceURL")}.${SERVER_DETAILS.DOMAIN}/reset#code=${resetCode}`
				};

				// Send forgot account details
				sendEmail(EMAIL_TYPE.FORGOT_PASSWORD, user.get("language"), received.emailAddress, emailParams, user.get("clientId"), user.get("id"));
			}

			// Create a response object
			return { status: 200, message: t("label.success") };
		} catch (error) {
			throw error;
		}
	});
}

// Send email with account details if user forgot their account or workspace url
export function forgotAccountEmail(received) {
	return database().transaction(async function(transaction) {
		try {
			// Check if email sent in the last 5 minutes
			const currentTime = new Date();
			const lastEmail = await models().sentEmails.findAll(
				{
					where: {
						to: received.emailAddress,
						emailType: EMAIL_TYPE.FORGOT_ACCOUNT_DETAILS,
						createdAt: {
							[database().Op.between]: [
								// Find all emails of type sent in last 5 minutes
								moment(currentTime)
									.utc()
									.subtract(5, "minutes")
									.format("YYYY-MM-DD HH:mm:ss"),
								moment(currentTime)
									.utc()
									.format("YYYY-MM-DD HH:mm:ss")
							]
						}
					}
				},
				{ transaction: transaction }
			);

			// Continue if no emails of type FORGOT_ACCOUNT_DETAILS sent in the last 5 minutes
			if (lastEmail === null || lastEmail.length === 0) {
				// Load list of all active user accounts associated with the email address
				const users = await models().user.findAll({ where: { emailAddress: received.emailAddress, active: true } }, { transaction: transaction });

				// Return success if no users associated with the email, or no accounts active
				if (users === null || users.length === 0) {
					return { status: 200, message: t("label.success") };
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
							gracePeriod: 2
						},
						{ transaction: transaction }
					);

					const account = {
						firstName: user.get("firstName"),
						lastName: user.get("lastName"),
						clientName: client.get("name"),
						workspaceLink: `${SERVER_DETAILS.PROTOCOL}://${client.get("workspaceURL")}.${SERVER_DETAILS.DOMAIN}/`,
						resetPasswordLink: `${SERVER_DETAILS.PROTOCOL}://${client.get("workspaceURL")}.${SERVER_DETAILS.DOMAIN}/reset#code=${resetCode}`
					};

					// Add account object to accounts array
					accounts.push(account);
				}

				// Create emailParams object
				const emailParams = {
					accounts: accounts
				};

				// Send forgot account details
				sendEmail(EMAIL_TYPE.FORGOT_ACCOUNT_DETAILS, users[0].get("language"), received.emailAddress, emailParams, null, null);
			}

			// Create a response object
			return { status: 200, message: t("label.success") };
		} catch (error) {
			throw error;
		}
	});
}

// Validate the reset code used to reset passwords
export function validateResetPasswordCode(resetCode) {
	return database().transaction(async function(transaction) {
		try {
			// Create a response object
			const response = { status: 200, message: t("label.success") };

			// Return the response object
			return response;
		} catch (error) {
			throw error;
		}
	});
}
