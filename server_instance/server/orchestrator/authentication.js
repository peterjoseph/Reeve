import { database, models } from "services/sequelize";
import { arrayContains } from "shared/utilities/filters";
import { FEATURES } from "shared/constants";
import { t } from "shared/translations/i18n";

// Validate Workspace URL
export function validateWorkspaceURL(workspaceURL) {
	return database().transaction(async function(transaction) {
		try {
			// Load client using workspaceURL
			let client = await models().client.findOne({ where: { workspaceURL: workspaceURL, active: true } }, { transaction: transaction });

			// Throw error if client was not returned for WorkspaceURL
			if (client === null || client.get("workspaceURL") === null || client.get("workspaceURL") !== workspaceURL) {
				const errorMsg = { status: 403, message: t("validation.clientInvalidProperties"), reason: { workspaceURL: [t("validation.emptyWorkspaceURL")] } };
				throw new errorMsg();
			}

			// Load list of features for client
			let features = await models().subscriptionFeatures.findAll({ where: { subscriptionId: client.get("subscriptionId") } }, { transaction: transaction });
			features = features.map(result => result.get("featureId"));

			// Load stying if client has styling feature
			if (arrayContains(FEATURES.STYLING, features)) {
				let clientStyling = await models().clientStyling.findOne({ where: { clientId: client.get("id") } }, { transaction: transaction });

				console.log(clientStyling);
			}

			return "success";
		} catch (error) {
			throw error;
		}
	});
}
