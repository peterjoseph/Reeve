import bcrypt from "bcrypt";

import { database, models } from "services/sequelize";
import { t } from "shared/translations/i18n";
import { variableExists, arrayHasAny } from "shared/utilities/filters";
import { LANGUAGE_CODES, ROLE_TYPE } from "shared/constants";
import { ServerResponseError } from "utilities/errors/serverResponseError";

import config from "../../config";

// Load Client
export function loadClient(requestProperties, authenticatedUser, browserLng) {
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

			// Fetch all active users for the client and count the total
			const countWorkspaceUsers = await models().user.count({ where: { clientId: authenticatedUser.clientId, active: true } }, { transaction: transaction });

			// Throw an error if no stripe plans are available
			if (countWorkspaceUsers === null || countWorkspaceUsers === 0) {
				throw new ServerResponseError(500, t("error.somethingWentWrong", { lng: browserLng }), null);
			}

			// Create response properties to be returned back to the front-end
			let clientProperties = {
				name: client.get("name"),
				description: client.get("description"),
				workspaceURL: client.get("workspaceURL"),
				createdDate: client.get("createdAt"),
				subscriptionType: client.get("subscriptionId"),
				defaultLanguage: client.get("defaultLanguage"),
				activeUsers: countWorkspaceUsers
			};

			// Create a response object
			const response = { status: 200, message: t("label.success", { lng: browserLng }), client: clientProperties };

			// Return the response object
			return response;
		} catch (error) {
			throw error;
		}
	});
}

// Update Client
export function updateClient(requestProperties, authenticatedUser, browserLng) {
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

			// Patch our client model
			if (requestProperties !== {}) {
				client.update(requestProperties);
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

// Load Localization
export function loadLocalization(requestProperties, authenticatedUser, browserLng) {
	return database().transaction(async function(transaction) {
		try {
			// Load client for authenticated user
			const client = await models().client.findOne({ where: { id: authenticatedUser.clientId, active: true } }, { transaction: transaction });

			// Throw an error if the client does not exist
			if (client === null) {
				throw new ServerResponseError(403, t("validation.loadUserPropertiesFailed", { lng: browserLng }), { client: [t("validation.loadClientFailed", { lng: browserLng })] });
			}

			// Create response properties to be returned back to the front-end
			let localizationProperties = {
				defaultLanguage: client.get("defaultLanguage")
			};

			// Create a response object
			const response = { status: 200, message: t("label.success", { lng: browserLng }), localization: localizationProperties };

			// Return the response object
			return response;
		} catch (error) {
			throw error;
		}
	});
}

// Update Localization
export function updateLocalization(requestProperties, authenticatedUser, browserLng) {
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

			// Change format of default language to integer
			if (variableExists(requestProperties.defaultLanguage)) {
				requestProperties.defaultLanguage = Object.keys(LANGUAGE_CODES).find(key => LANGUAGE_CODES[key] === requestProperties.defaultLanguage);
			}

			// Patch the client model with our localization properties
			if (requestProperties !== {}) {
				client.update(requestProperties);
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

// Delete Workspace
export function deleteWorkspace(requestProperties, authenticatedUser, browserLng) {
	return database().transaction(async function(transaction) {
		try {
			// Load client for authenticated user
			const client = await models().client.findOne({ where: { id: authenticatedUser.clientId, active: true } }, { transaction: transaction });

			// Throw an error if the client does not exist
			if (client === null) {
				throw new ServerResponseError(403, t("validation.loadUserPropertiesFailed", { lng: browserLng }), { client: [t("validation.loadClientFailed", { lng: browserLng })] });
			}

			// Validate workspace name
			if (requestProperties.workspaceURL !== client.get("workspaceURL")) {
				throw new ServerResponseError(403, t("validation.userInvalidProperties", { lng: browserLng }), { workspaceURL: [t("validation.incorrectWorkspaceURL", { lng: browserLng })] });
			}

			// Load user properties for authenticated user
			const user = await models().user.findOne({ where: { id: authenticatedUser.userId, clientId: client.get("id"), active: true } }, { transaction: transaction });

			// Throw an error if the user does not exist
			if (user === null) {
				throw new ServerResponseError(403, t("validation.loadUserPropertiesFailed", { lng: browserLng }), { user: [t("validation.loadUserPropertiesFailed", { lng: browserLng })] });
			}

			// Load user roles
			let roles = await models().userRoles.findAll({ where: { userId: user.get("id") } }, { transaction: transaction });

			// Map role id's to an array
			if (roles === null || roles.length === 0) {
				throw new ServerResponseError(403, t("validation.loadUserPropertiesFailed", { lng: browserLng }), { roles: [t("validation.loadUserRolesFailed", { lng: browserLng })] });
			}
			roles = roles.map(result => result.get("roleId"));

			// Check that the authenticated user has owner role
			if (!arrayHasAny([ROLE_TYPE.OWNER], roles)) {
				throw new ServerResponseError(403, t("error.code.403", { lng: browserLng }));
			}

			// Check that the supplied password matches the one stored in database
			const valid = await bcrypt.compare(requestProperties.accountPassword, user.get("password"));
			if (valid === false) {
				throw new ServerResponseError(403, t("validation.userInvalidProperties", { lng: browserLng }), { password: [t("validation.incorrectCurrentPasswordSupplied", { lng: browserLng })] });
			}

			// Store client id in variable
			const clientId = client.get("id");

			// Check GDPR enabled
			if (config.deleteWorkspace.GDPRDelete == true) {
				// Delete row from client table
				await models().client.destroy({ where: { id: clientId, active: true } }, { transaction: transaction });

				// Iterate over list of users and delete all roles in userRoles table
				let users = await models().user.findAll({ where: { clientId: clientId } }, { transaction: transaction });
				users = users.map(result => result.get("id"));
				for (let userId of users) {
					await models().userRoles.destroy({ where: { userId: userId } }, { transaction: transaction });
				}

				// Delete owner and all other users from user table
				await models().user.destroy({ where: { clientId: clientId } }, { transaction: transaction });

				// Delete row from clientStyling
				await models().clientStyling.destroy({ where: { clientId: clientId } }, { transaction: transaction });
			} else {
				// Inactivate row from client table
				await models().client.update({ active: false }, { where: { id: clientId, active: true } }, { transaction: transaction });

				// Iterate over list of users and inactivate all roles in userRoles table
				let users = await models().user.findAll({ where: { clientId: clientId } }, { transaction: transaction });
				users = users.map(result => result.get("id"));
				for (let userId of users) {
					await models().userRoles.update({ active: false }, { where: { userId: userId } }, { transaction: transaction });
				}

				// Inactivate owner and all other users from user table
				await models().user.update({ active: false }, { where: { clientId: clientId } }, { transaction: transaction });
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
