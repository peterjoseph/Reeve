import bcrypt from "bcrypt";

import { database, models } from "services/sequelize";
import { sendEmail } from "services/nodemailer";

import { t } from "shared/translations/i18n";
import { EMAIL_TYPE, LANGUAGE_CODES } from "shared/constants";
import { ServerResponseError } from "utilities/errors/serverResponseError";

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
