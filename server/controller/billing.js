import restrict from "utilities/restrictRoutes";
import browserResponseLng from "utilities/browserResponseLng";
import { ROLE_TYPE, FEATURES } from "shared/constants";

import { loadClientSubscriptionDetails, loadAvailableSubscriptions } from "../orchestrator/billing";

module.exports = function(router) {
	// Load client subscription details
	router.get(
		"/api/client_subscription_details/",
		restrict({
			registered: true,
			unregistered: true,
			hasAnyRole: [ROLE_TYPE.OWNER, ROLE_TYPE.FINANCE],
			hasFeatures: [FEATURES.BILLING]
		}),
		function(req, res, next) {
			// Load browser language from header
			const browserLng = browserResponseLng(req);

			// Retrieve client subscription details and return response
			loadClientSubscriptionDetails(browserLng).then(
				result => {
					return res.status(200).send(result);
				},
				error => {
					return next(error);
				}
			);
		}
	);

	// Load List of available subscriptions
	router.get(
		"/api/available_subscriptions/",
		restrict({
			registered: true,
			unregistered: true,
			hasAnyRole: [ROLE_TYPE.OWNER, ROLE_TYPE.FINANCE],
			hasFeatures: [FEATURES.BILLING]
		}),
		function(req, res, next) {
			// Load browser language from header
			const browserLng = browserResponseLng(req);

			// Retrieve client subscription details and return response
			loadAvailableSubscriptions(browserLng).then(
				result => {
					return res.status(200).send(result);
				},
				error => {
					return next(error);
				}
			);
		}
	);
};
