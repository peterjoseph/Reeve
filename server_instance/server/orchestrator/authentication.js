import { database, models } from "services/sequelize";

// Validate Workspace URL
export async function validateWorkspaceURL(workspaceURL) {
	database().transaction(function(t) {
		models()
			.Client.findAll({}, { transaction: t })
			.then(results => {
				console.log(results);
			})
			.catch(function(e) {
				console.log(e);
			});

		// Fetch workspace URL from client object
		// Check workspace URL already in use
		// Subscription features list
		// Client styling
	});
}
