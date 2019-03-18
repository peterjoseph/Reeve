import passport from "services/passport";

import { t } from "shared/translations/i18n";
import { ServerResponseError } from "utilities/errors/serverResponseError";
import { arrayContains, arrayHasAny } from "shared/utilities/filters";
import config from "../../config";

export default function(properties = {}) {
	return function(req, res, next) {
		passport.perform().authenticate("jwt", function(error, user, info) {
			if (error) {
				return next(error);
			}

			// Define unauthorized error message
			const errorMsg = new ServerResponseError(403, t("error.code.403"), null);

			// Check if properties params contain logged in restrictions
			const registered = properties.registered;
			const unregistered = properties.unregistered;

			if (!user) {
				// If no user exists but route is restricted to logged in users, throw error
				if (registered === true && !unregistered) {
					return next(errorMsg);
				} else {
					return next();
				}
			}

			// If user exists but route restricted to not logged in users, throw error
			if (unregistered === true && !registered) {
				return next(errorMsg);
			} else {
				req.user = user;
			}

			// If stripe enabled and subscription not active, redirect to billing page
			if (config.stripe.enabled) {
				if (properties.activeSubscription === true && req.user && req.user.subscriptionActive !== true) {
					const url = `${config.build.protocol}://${req.user.workspaceURL}.${config.build.domainPath}/billing`;
					return res.redirect(url);
				}
			}

			// Error if user is missing correct role
			if (properties.hasAnyRole && !arrayHasAny(properties.hasAnyRole, req.user.roles || [])) {
				return next(errorMsg);
			}

			// Error if user is missing correct feature
			if (properties.hasFeatures && !arrayContains(properties.hasFeatures, req.user.features || [])) {
				return next(errorMsg);
			}

			// Error if user does not have a verified email address
			if (properties.emailVerified && req.user && req.user.emailVerified !== true) {
				return next(errorMsg);
			}

			// Continue if all requirements are passed
			if (req.user !== null) {
				return next();
			}

			// Default deny policy
			return next(errorMsg);
		})(req, res, next);
	};
}
