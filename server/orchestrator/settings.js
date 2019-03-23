import { database, models } from "services/sequelize";
import { t } from "shared/translations/i18n";
import { ServerResponseError } from "utilities/errors/serverResponseError";

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

			// Create user properties object to be returned back to the front-end
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
