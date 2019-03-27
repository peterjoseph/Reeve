import restrict from "utilities/restrictRoutes";
import browserResponseLng from "utilities/browserResponseLng";
import { ServerResponseError } from "utilities/errors/serverResponseError";

import validate from "shared/validation/validate";
import { t } from "shared/translations/i18n";
import { ROLE_TYPE } from "shared/constants";
import { updateClient as updateClientValidation, updateLocalization as updateLocalizationValidation, deleteWorkspace as deleteWorkspaceValidation } from "shared/validation/settings";
import { removeUniqueProperties } from "shared/utilities/filters";

import { loadClient, updateClient, loadLocalization, updateLocalization, deleteWorkspace } from "../orchestrator/settings";

module.exports = function(router) {
	// Load Client
	router.get(
		"/api/v1.0/client",
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
		"/api/v1.0/client",
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

	// Load Localization Settings
	router.get(
		"/api/v1.0/settings/localization",
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
			loadLocalization(null, authenticatedUser, browserLng).then(
				result => {
					return res.status(200).send(result);
				},
				error => {
					return next(error);
				}
			);
		}
	);

	// Update Localization Settings
	router.patch(
		"/api/v1.0/settings/localization",
		restrict({
			registered: true,
			unregistered: false
		}),
		function(req, res, next) {
			// Load browser language from header
			const browserLng = browserResponseLng(req);

			// We receive a PATCH object and need to make sure the user isn't sending across dangerous properties we don't want
			const requestProperties = removeUniqueProperties({ ...req.body }, ["defaultLanguage"]);

			// Create user information object
			const authenticatedUser = {
				userId: req.user.userId,
				clientId: req.user.clientId
			};

			// Validate properties in received object
			const valid = validate(requestProperties, updateLocalizationValidation("patch"));

			if (valid != null) {
				const errorMsg = new ServerResponseError(403, t("validation.updateLocalizationInvalidProperties", { lng: browserLng }), valid);
				return next(errorMsg);
			}

			// Perform new client parameters write and return response
			updateLocalization(requestProperties, authenticatedUser, browserLng).then(
				result => {
					return res.status(200).send(result);
				},
				error => {
					return next(error);
				}
			);
		}
	);

	// Delete Workspace
	router.post("/api/v1.0/settings/delete_workspace", restrict({ registered: true, unregistered: false, hasAllRoles: [ROLE_TYPE.OWNER] }), function(req, res, next) {
		// Store received object properties
		const requestProperties = {
			workspaceURL: req.body.workspaceURL,
			accountPassword: req.body.accountPassword
		};

		// Load browser language from header
		const browserLng = browserResponseLng(req);

		// Create user authentication object
		const authenticatedUser = {
			userId: req.user.userId,
			clientId: req.user.clientId
		};

		// Validate properties in received object
		const valid = validate(requestProperties, deleteWorkspaceValidation());
		if (valid != null) {
			const errorMsg = new ServerResponseError(403, t("validation.deleteWorkspaceInvalidProperties", { lng: browserLng }), valid);
			return next(errorMsg);
		}

		// Validate change email code and return response
		deleteWorkspace(requestProperties, authenticatedUser, browserLng).then(
			result => {
				return res.status(200).send(result);
			},
			error => {
				return next(error);
			}
		);
	});
};
