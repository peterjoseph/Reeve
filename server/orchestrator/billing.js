import { database, models } from "services/sequelize";
import { t } from "shared/translations/i18n";
import { ServerResponseError } from "utilities/errors/serverResponseError";

// Load client subscription details
export function loadClientSubscriptionDetails(browserLng) {
	return database().transaction(async function(transaction) {
		try {
			// Create a response object
			const response = { status: 200, message: t("label.success", { lng: browserLng }) };

			// Return the response object
			return response;
		} catch (error) {
			throw error;
		}
	});
}

// Load list of available subscriptions
export function loadAvailableSubscriptions(browserLng) {
	return database().transaction(async function(transaction) {
		try {
			// Load a list of available stripe plans
			const loadPlans = await models().plans.findAll(
				{
					where: { newSubscriptionsAllowed: true, active: true },
					attributes: { exclude: ["name", "description", "stripeProductId", "createdAt", "updatedAt", "newSubscriptionsAllowed", "active"] }
				},
				{ transaction: transaction }
			);

			// Throw an error if no stripe plans are available
			if (loadPlans === null) {
				throw new ServerResponseError(500, t("error.somethingWentWrong", { lng: browserLng }), null);
			}

			const plans = JSON.parse(JSON.stringify(loadPlans));

			// Create a response object
			const response = { status: 200, message: t("label.success", { lng: browserLng }), subscriptions: plans };

			// Return the response object
			return response;
		} catch (error) {
			throw error;
		}
	});
}
