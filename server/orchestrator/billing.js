import { database, models } from "services/sequelize";
import { t } from "shared/translations/i18n";

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
			// Create a response object
			const response = { status: 200, message: t("label.success", { lng: browserLng }) };

			// Return the response object
			return response;
		} catch (error) {
			throw error;
		}
	});
}
