import passport from "services/passport";

import { t } from "shared/translations/i18n";
import { ServerResponseError } from "utilities/errors/serverResponseError";
import { arrayContains, arrayHasAny, variableExists } from "shared/utilities/filters";
import { extractSubdomain } from "shared/utilities/domains";
import config from "../../config";

export default function(properties = {}) {
	return function(req, res, next) {
		passport.perform().authenticate("jwt", { session: false }, function(error, user, info) {
			if (error) {
				return next(error);
			}

			// Check if properties params contain logged in restrictions
			const registered = properties.registered;
			const unregistered = properties.unregistered;

			// Define unauthorized error message
			const errorMsg = new ServerResponseError(403, t("error.code.403"), null);

			// If user object is not successfully loaded throw error message
			if (!variableExists(user) || user === false) {
				// If no user exists but route is restricted to logged in users, throw error
				if (registered === true && !unregistered) {
					const subdomain = extractSubdomain(req.headers.origin);
					const url = `${config.build.protocol}://${subdomain ? subdomain + "." : ""}${config.build.domainPath}/signin`;
					return res.redirect(url);
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

			// Error if user is missing any of the following roles
			if (properties.hasAllRoles && !arrayHasAny(properties.hasAllRoles, req.user.roles || [])) {
				return next(errorMsg);
			}

			// Error if user is missing any of the following features
			if (properties.hasAnyFeature && !arrayHasAny(properties.hasAnyFeature, req.user.features || [])) {
				return next(errorMsg);
			}

			// Error if user is missing all of the following features
			if (properties.hasAllFeatures && !arrayContains(properties.hasAllFeatures, req.user.features || [])) {
				return next(errorMsg);
			}

			// Error if user has incorrect subscription
			if (properties.hasAnySubscription && (!req.user.subscriptionId || !arrayHasAny(properties.hasAnySubscription, req.user.subscriptionId) || [])) {
				return null;
			}

			// Error if user does not have a verified email address
			if (properties.emailVerified && req.user && req.user.emailVerified !== true) {
				return next(errorMsg);
			}

			// Continue if all requirements are passed
			if (variableExists(req.user)) {
				return next();
			}

			// Default deny policy
			return next(errorMsg);
		})(req, res, next);
	};
}
