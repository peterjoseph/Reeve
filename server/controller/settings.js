import restrict from "utilities/restrictRoutes";
import browserResponseLng from "utilities/browserResponseLng";
import { ServerResponseError } from "utilities/errors/serverResponseError";

import validate from "shared/validation/validate";
import { t } from "shared/translations/i18n";
import { updateClient as updateClientValidation } from "shared/validation/settings";
import { removeUniqueProperties } from "shared/utilities/filters";

import { loadClient, updateClient } from "../orchestrator/settings";

module.exports = function(router) {
	// Load Client
	router.get(
		"/api/v1.0/client/",
		restrict({
			registered: true,
			unregistered: false
		}),
		function(req, res, next) {
			// Load browser language from header
			const browserLng = browserResponseLng(req);

			// Create object with authenticated user information
			const authenticatedUser = {
				userId: req.user.userId,
				clientId: req.user.clientId
			};

			// Retrieve client details and return response
			loadClient(null, authenticatedUser, browserLng).then(
				result => {
					return res.status(200).send(result);
				},
				error => {
					return next(error);
				}
			);
		}
	);

	// Update Client
	router.patch(
		"/api/v1.0/client/",
		restrict({
			registered: true,
			unregistered: false
		}),
		function(req, res, next) {
			// Load browser language from header
			const browserLng = browserResponseLng(req);

			// We receive a PATCH object and need to make sure the user isn't sending across dangerous properties we don't want
			const requestProperties = removeUniqueProperties({ ...req.body }, ["name", "description"]);

			// Create user information object
			const authenticatedUser = {
				userId: req.user.userId,
				clientId: req.user.clientId
			};

			// Validate properties in received object
			const valid = validate(requestProperties, updateClientValidation("patch"));

			if (valid != null) {
				const errorMsg = new ServerResponseError(403, t("validation.updateClientInvalidProperties", { lng: browserLng }), valid);
				return next(errorMsg);
			}

			// Perform new client parameters write and return response
			updateClient(requestProperties, authenticatedUser, browserLng).then(
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
