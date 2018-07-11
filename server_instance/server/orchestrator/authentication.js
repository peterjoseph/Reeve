import bcrypt from "bcrypt";
import { database, models } from "services/sequelize";
import { arrayContains } from "shared/utilities/filters";
import { ServerResponseError } from "utilities/errors/serverResponseError";
import { t } from "shared/translations/i18n";
import { FEATURES, SUBSCRIPTION_TYPE, ROLE_TYPE } from "shared/constants";

// Validate Workspace URL and retrieve client styling (if feature exists)
export function validateWorkspaceURL(workspaceURL) {
	return database().transaction(async function(transaction) {
		try {
			// Load a client using a workspaceURL
			let client = await models().client.findOne({ where: { workspaceURL: workspaceURL, active: true } }, { transaction: transaction });

			// Throw an error if the client was not returned for the WorkspaceURL
			if (client === null || client.get("workspaceURL") === null || client.get("workspaceURL") !== workspaceURL) {
				throw new ServerResponseError(403, t("validation.clientInvalidProperties"), { workspaceURL: [t("validation.emptyWorkspaceURL")] });
			}

			// Load list of features for client based on their subscription id
			let features = await models().subscriptionFeatures.findAll({ where: { subscriptionId: client.get("subscriptionId") } }, { transaction: transaction });

			// Map feature id's to an array
			if (features != null) {
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

// Register new Client
export function registerNewClient(received) {
	return database().transaction(async function(transaction) {
		try {
			// Check if client already exists for workspaceURL
			let client = await models().client.findOne({ where: { workspaceURL: received.workspaceURL, active: true } }, { transaction: transaction });

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

			// Create a response object
			const response = { status: 200, message: t("label.success") };

			// Return the response object
			return response;
		} catch (error) {
			throw error;
		}
	});
}
