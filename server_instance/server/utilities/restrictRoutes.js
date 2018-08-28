import passport from "../services/passport";
import { arrayContains } from "shared/utilities/filters";
import { RESTRICT_ROUTES } from "shared/constants";
import { t } from "shared/translations/i18n";
import { ServerResponseError } from "utilities/errors/serverResponseError";

export default function(properties) {
	return async function(req, res, next) {
		await passport.perform().authenticate("jwt", function(error, user, info) {
			if (error) {
				return next(error);
			}

			// Define unauthorized error message
			const errorMsg = new ServerResponseError(403, t("error.code.403"), null);

			if (!user) {
				if (arrayContains(RESTRICT_ROUTES.LOGGED_IN, properties || [])) {
					return next(errorMsg);
				} else {
					return next();
				}
			} else {
				if (arrayContains(RESTRICT_ROUTES.NOT_LOGGED_IN, properties || [])) {
					return next(errorMsg);
				} else {
					req.user = user;
					return next();
				}
			}
		})(req, res, next);
	};
}
