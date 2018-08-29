import passport from "services/passport";

import { arrayContains } from "shared/utilities/filters";
import { RESTRICT_ROUTES } from "shared/constants";
import { t } from "shared/translations/i18n";
import { billingURL } from "shared/utilities/urls";
import { ServerResponseError } from "utilities/errors/serverResponseError";

export default function(properties) {
	return function(req, res, next) {
		passport.perform().authenticate("jwt", function(error, user, info) {
			if (error) {
				return next(error);
			}

			// Define unauthorized error message
			const errorMsg = new ServerResponseError(403, t("error.code.403"), null);

			if (!user) {
				// If no user exists but route is restricted to logged in users, throw error
				if (arrayContains(RESTRICT_ROUTES.LOGGED_IN, properties || [])) {
					return next(errorMsg);
				} else {
					return next();
				}
			}

			// If user exists but route restricted to not logged in users, throw error
			if (arrayContains(RESTRICT_ROUTES.NOT_LOGGED_IN, properties || [])) {
				return next(errorMsg);
			} else {
				req.user = user;
			}

			// If subscription not active, redirect to billing page
			if (arrayContains(RESTRICT_ROUTES.SUBSCRIPTION_ACTIVE, properties || []) && req.user.subscriptionActive !== true) {
				const url = billingURL(req.user.workspaceURL);
				return res.redirect(url);
			} else {
				return next();
			}
		})(req, res, next);
	};
}
