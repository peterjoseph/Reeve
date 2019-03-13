import restrict from "utilities/restrictRoutes";
import browserResponseLng from "utilities/browserResponseLng";
import { ServerResponseError } from "utilities/errors/serverResponseError";

import validate from "shared/validation/validate";
import { t } from "shared/translations/i18n";
import { updateUserProfile, verifyEmail, changeSavedLanguage, changeUserPassword } from "shared/validation/profile";

import { loadProfile, updateProfile, verifyUserEmailChange, changeLanguage, changePassword } from "../orchestrator/profile";

module.exports = function(router) {
	// Load personal profile details
	router.get(
		"/api/profile/",
		restrict({
			registered: true,
			unregistered: false
		}),
		function(req, res, next) {
			// Load browser language from header
			const browserLng = browserResponseLng(req);

			// Create object with authenticated user information
			const body = {
				userId: req.user.userId,
				clientId: req.user.clientId
			};

			// Retrieve user profile details and return response
			loadProfile(body, browserLng).then(
				result => {
					return res.status(200).send(result);
				},
				error => {
					return next(error);
				}
			);
		}
	);

	// Update user profile
	router.post(
		"/api/profile/update/",
		restrict({
			registered: true,
			unregistered: false
		}),
		function(req, res, next) {
			// Store received object properties
			const body = {
				firstName: req.body.firstName,
				lastName: req.body.lastName,
				emailAddress: req.body.emailAddress,
				bio: req.body.bio,
				location: req.body.location,
				website: req.body.website
			};

			// Load browser language from header
			const browserLng = browserResponseLng(req);

			// Append user information to body object
			body.userId = req.user.userId;
			body.clientId = req.user.clientId;

			// Validate properties in received object
			const valid = validate(body, updateUserProfile());
			if (valid != null) {
				const errorMsg = new ServerResponseError(403, t("validation.updateProfileInvalidProperties", { lng: browserLng }), valid);
				return next(errorMsg);
			}

			// Perform new profile information write and return response
			updateProfile(body, browserLng).then(
				result => {
					return res.status(200).send(result);
				},
				error => {
					return next(error);
				}
			);
		}
	);

	// Verify User Email Change
	router.post("/api/verify/email_change/", restrict({ registered: true, unregistered: true }), function(req, res, next) {
		// Store received object properties
		const body = {
			code: req.body.code,
			userId: req.body.userId,
			workspaceURL: req.body.workspaceURL
		};

		// Load browser language from header
		const browserLng = browserResponseLng(req);

		// Validate properties in received object
		const valid = validate(body, verifyEmail());
		if (valid != null) {
			const errorMsg = new ServerResponseError(403, t("validation.verifyChangeEmailInvalidProperties", { lng: browserLng }), valid);
			return next(errorMsg);
		}

		// Validate change email code and return response
		verifyUserEmailChange(body, browserLng).then(
			result => {
				return res.status(200).send(result);
			},
			error => {
				return next(error);
			}
		);
	});

	// Change User Language
	router.post(
		"/api/change_user_language/",
		restrict({
			registered: true,
			unregistered: false
		}),
		function(req, res, next) {
			// Store received object properties
			const body = {
				language: req.body.language
			};

			// Load browser language from header
			const browserLng = browserResponseLng(req);

			// Append user information to body object
			body.userId = req.user.userId;
			body.clientId = req.user.clientId;

			// Validate properties in received object
			const valid = validate(body, changeSavedLanguage());
			if (valid != null) {
				const errorMsg = new ServerResponseError(403, t("validation.changeLanguageInvalidProperties", { lng: browserLng }), valid);
				return next(errorMsg);
			}

			// Validate new language and return response
			changeLanguage(body, browserLng).then(
				result => {
					return res.status(200).send(result);
				},
				error => {
					return next(error);
				}
			);
		}
	);

	// Change User Password
	router.post(
		"/api/change_password/",
		restrict({
			registered: true,
			unregistered: false
		}),
		function(req, res, next) {
			// Store received object properties
			const body = {
				currentPassword: req.body.currentPassword,
				newPassword: req.body.newPassword,
				confirmPassword: req.body.confirmPassword
			};

			// Load browser language from header
			const browserLng = browserResponseLng(req);

			// Append user information to body object
			body.userId = req.user.userId;
			body.clientId = req.user.clientId;

			// Validate properties in received object
			const valid = validate(body, changeUserPassword());
			if (valid != null) {
				const errorMsg = new ServerResponseError(403, t("validation.changePasswordInvalidProperties", { lng: browserLng }), valid);
				return next(errorMsg);
			}

			// Validate new password and return response
			changePassword(body, browserLng).then(
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
