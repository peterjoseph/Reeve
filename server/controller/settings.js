import restrict from "utilities/restrictRoutes";
import browserResponseLng from "utilities/browserResponseLng";
import { ServerResponseError } from "utilities/errors/serverResponseError";

import validate from "shared/validation/validate";
import { t } from "shared/translations/i18n";
import { ROLE_TYPE, FEATURES } from "shared/constants";
import {
	updateClient as updateClientValidation,
	updateClientStyling as updateClientStylingValidation,
	updateLocalization as updateLocalizationValidation,
	deleteWorkspace as deleteWorkspaceValidation
} from "shared/validation/settings";
import { removeUniqueProperties, variableExists } from "shared/utilities/filters";

import {
	loadClient,
	updateClient,
	loadClientStyling,
	updateClientStyling,
	resetClientStyling,
	generateSignedPhotoURL,
	loadLocalization,
	updateLocalization,
	deleteWorkspace
} from "../orchestrator/settings";

module.exports = function(router) {
	// Load Client
	router.get(
		"/api/v1.0/settings",
		restrict({
			registered: true,
			unregistered: false,
			hasAnyRole: [ROLE_TYPE.OWNER, ROLE_TYPE.ADMINISTRATOR]
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
		"/api/v1.0/settings",
		restrict({
			registered: true,
			unregistered: false,
			hasAnyRole: [ROLE_TYPE.OWNER, ROLE_TYPE.ADMINISTRATOR]
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

	// Load Client Styling
	router.get(
		"/api/v1.0/settings/workspace-styling",
		restrict({
			registered: true,
			unregistered: false,
			hasAnyRole: [ROLE_TYPE.OWNER, ROLE_TYPE.ADMINISTRATOR],
			hasAllFeatures: [FEATURES.STYLING]
		}),
		function(req, res, next) {
			// Load browser language from header
			const browserLng = browserResponseLng(req);

			// Create object with authenticated user information
			const authenticatedUser = {
				userId: req.user.userId,
				clientId: req.user.clientId
			};

			// Retrieve client styling and return response
			loadClientStyling(null, authenticatedUser, browserLng).then(
				result => {
					return res.status(200).send(result);
				},
				error => {
					return next(error);
				}
			);
		}
	);

	// Update Client Styling
	router.patch(
		"/api/v1.0/settings/workspace-styling",
		restrict({
			registered: true,
			unregistered: false,
			hasAnyRole: [ROLE_TYPE.OWNER, ROLE_TYPE.ADMINISTRATOR],
			hasAllFeatures: [FEATURES.STYLING]
		}),
		function(req, res, next) {
			// Load browser language from header
			const browserLng = browserResponseLng(req);

			// We receive a PATCH object and need to make sure the user isn't sending across dangerous properties we don't want
			const requestProperties = removeUniqueProperties({ ...req.body }, ["logoImage", "backgroundImage", "backgroundColor", "primaryColor", "secondaryColor"]);

			// Create user information object
			const authenticatedUser = {
				userId: req.user.userId,
				clientId: req.user.clientId
			};

			// Validate properties in received object
			const valid = validate(requestProperties, updateClientStylingValidation("patch"));

			if (valid != null) {
				const errorMsg = new ServerResponseError(403, t("validation.updateClientStylingInvalidProperties", { lng: browserLng }), valid);
				return next(errorMsg);
			}

			// Perform new client parameters write and return response
			updateClientStyling(requestProperties, authenticatedUser, browserLng).then(
				result => {
					return res.status(200).send(result);
				},
				error => {
					return next(error);
				}
			);
		}
	);

	// Reset Client Styling
	router.post(
		"/api/v1.0/settings/reset-workspace-styling",
		restrict({
			registered: true,
			unregistered: false,
			hasAnyRole: [ROLE_TYPE.OWNER, ROLE_TYPE.ADMINISTRATOR],
			hasAllFeatures: [FEATURES.STYLING]
		}),
		function(req, res, next) {
			// Load browser language from header
			const browserLng = browserResponseLng(req);

			// Create user information object
			const authenticatedUser = {
				userId: req.user.userId,
				clientId: req.user.clientId
			};

			// Remove client styling row from db and return response
			resetClientStyling(null, authenticatedUser, browserLng).then(
				result => {
					return res.status(200).send(result);
				},
				error => {
					return next(error);
				}
			);
		}
	);

	// Generate a signed url to upload client styling photos
	router.get(
		"/api/v1.0/settings/generate-signed-photo-url",
		restrict({
			registered: true,
			unregistered: false,
			hasAnyRole: [ROLE_TYPE.OWNER, ROLE_TYPE.ADMINISTRATOR],
			hasAllFeatures: [FEATURES.STYLING]
		}),
		function(req, res, next) {
			// Get workspaceURL name from header
			const contentType = req.headers["contenttype"] ? req.headers["contenttype"] : "";

			// Load browser language from header
			const browserLng = browserResponseLng(req);

			// Validate header item exists and contentType is of suitable format
			if (!variableExists(contentType) || !["image/jpg", "image/jpeg", "image/png"].includes(contentType)) {
				const error = new ServerResponseError(403, t("validation.signedURLInvalidProperties", { lng: browserLng }), { contentType: [t("validation.invalidContentType", { lng: browserLng })] });
				return next(error);
			}

			// Store contentType in new object
			const requestProperties = {
				contentType: contentType
			};

			// Create object with authenticated user information
			const authenticatedUser = {
				userId: req.user.userId,
				clientId: req.user.clientId
			};

			// Generate signed url and return response
			generateSignedPhotoURL(requestProperties, authenticatedUser, browserLng).then(
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
			unregistered: false,
			hasAnyRole: [ROLE_TYPE.OWNER, ROLE_TYPE.ADMINISTRATOR]
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
			unregistered: false,
			hasAnyRole: [ROLE_TYPE.OWNER, ROLE_TYPE.ADMINISTRATOR]
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
	router.post("/api/v1.0/settings/delete-workspace", restrict({ registered: true, unregistered: false, hasAllRoles: [ROLE_TYPE.OWNER] }), function(req, res, next) {
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
