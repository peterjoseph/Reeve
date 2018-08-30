import passport from "services/passport";

import { t } from "shared/translations/i18n";
import { billingURL } from "shared/utilities/urls";
import { ServerResponseError } from "utilities/errors/serverResponseError";

export default function(properties = {}) {
	return function(req, res, next) {
		passport.perform().authenticate("jwt", function(error, user, info) {
			if (error) {
				return next(error);
			}

			// Define unauthorized error message
			const errorMsg = new ServerResponseError(403, t("error.code.403"), null);

			// Check if properties params contain logged in restrictions
			const loggedIn = properties.loggedIn;
			const notLoggedIn = properties.notLoggedIn;

			if (!user) {
				// If no user exists but route is restricted to logged in users, throw error
				if (loggedIn === true && !notLoggedIn) {
					return next(errorMsg);
				} else {
					return next();
				}
			}

			// If user exists but route restricted to not logged in users, throw error
			if (notLoggedIn === true && !loggedIn) {
				return next(errorMsg);
			} else {
				req.user = user;
			}

			// If subscription not active, redirect to billing page
			if (properties.activeSubscription === true && req.user && req.user.subscriptionActive !== true) {
				const url = billingURL(req.user.workspaceURL);
				return res.redirect(url);
			}

			return next();
		})(req, res, next);
	};
}
