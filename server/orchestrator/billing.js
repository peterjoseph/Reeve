import { database, models } from "services/sequelize";
import { t } from "shared/translations/i18n";
import { ServerResponseError } from "utilities/errors/serverResponseError";
import { PAYMENT_CURRENCY, PAYMENT_INTERVALS } from "shared/constants";
import { variableExists } from "shared/utilities/filters";

// Load client subscription details
export function loadClientSubscriptionDetails(requestProperties, authenticatedUser, browserLng) {
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
export function loadAvailableSubscriptions(requestProperties, authenticatedUser, browserLng) {
	return database().transaction(async function(transaction) {
		try {
			// Filter subscriptions based on parameters
			const filterAttributes = { newSubscriptionsAllowed: true, active: true };

			// Filter by currency
			if (variableExists(requestProperties.currency)) {
				filterAttributes.currency = PAYMENT_CURRENCY[requestProperties.currency.toUpperCase()] || null;
			}

			// Filter by payment interval
			if (variableExists(requestProperties.interval)) {
				filterAttributes.billingInterval = PAYMENT_INTERVALS[requestProperties.interval.toUpperCase()] || null;
			}

			// Load a list of available stripe plans
			const loadPlans = await models().plans.findAll(
				{
					where: filterAttributes,
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
