import restrict from "utilities/restrictRoutes";
import browserResponseLng from "utilities/browserResponseLng";
import { ROLE_TYPE, FEATURES } from "shared/constants";

import { loadClientSubscriptionDetails, loadAvailableSubscriptions } from "../orchestrator/billing";

module.exports = function(router) {
	// Load client subscription details
	router.get(
		"/api/v1.0/billing/client-subscription-details",
		restrict({
			registered: true,
			unregistered: true,
			hasAnyRole: [ROLE_TYPE.OWNER, ROLE_TYPE.FINANCE],
			hasAllFeatures: [FEATURES.BILLING]
		}),
		function(req, res, next) {
			// Load browser language from header
			const browserLng = browserResponseLng(req);

			// Retrieve client subscription details and return response
			loadClientSubscriptionDetails(null, null, browserLng).then(
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
		"/api/v1.0/billing/available-subscriptions",
		restrict({
			registered: true,
			unregistered: true,
			hasAnyRole: [ROLE_TYPE.OWNER, ROLE_TYPE.FINANCE],
			hasAllFeatures: [FEATURES.BILLING]
		}),
		function(req, res, next) {
			// Load browser language from header
			const browserLng = browserResponseLng(req);

			// Check for Query strings
			const requestProperties = { currency: req.query.currency, interval: req.query.interval };

			// Retrieve client subscription details and return response
			loadAvailableSubscriptions(requestProperties, null, browserLng).then(
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
