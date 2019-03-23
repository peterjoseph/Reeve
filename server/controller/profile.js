import restrict from "utilities/restrictRoutes";
import browserResponseLng from "utilities/browserResponseLng";
import { ServerResponseError } from "utilities/errors/serverResponseError";

import { variableExists, keyNameCorrect } from "shared/utilities/filters";
import validate from "shared/validation/validate";
import { t } from "shared/translations/i18n";
import { updateUserProfile, verifyEmail, changeSavedLanguage, changeUserPassword } from "shared/validation/profile";

import {
	loadProfile,
	updateProfile,
	verifyUserEmailChange,
	changeLanguage,
	changePassword,
	generateSignedProfilePhotoURL,
	saveUserProfilePhoto,
	deleteUserProfilePhoto
} from "../orchestrator/profile";

module.exports = function(router) {
	// Load personal profile details
	router.get(
		"/api/v1.0/profile/",
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

			// Retrieve user profile details and return response
			loadProfile(null, authenticatedUser, browserLng).then(
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
		"/api/v1.0/profile/",
		restrict({
			registered: true,
			unregistered: false
		}),
		function(req, res, next) {
			// Store received object properties
			const requestProperties = {
				firstName: req.body.firstName,
				lastName: req.body.lastName,
				emailAddress: req.body.emailAddress,
				bio: req.body.bio,
				location: req.body.location,
				website: req.body.website
			};

			// Load browser language from header
			const browserLng = browserResponseLng(req);

			// Create user information object
			const authenticatedUser = {
				userId: req.user.userId,
				clientId: req.user.clientId
			};

			// Validate properties in received object
			const valid = validate(requestProperties, updateUserProfile());
			if (valid != null) {
				const errorMsg = new ServerResponseError(403, t("validation.updateProfileInvalidProperties", { lng: browserLng }), valid);
				return next(errorMsg);
			}

			// Perform new profile information write and return response
			updateProfile(requestProperties, authenticatedUser, browserLng).then(
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
	router.post("/api/v1.0/verify/email_change/", restrict({ registered: true, unregistered: true }), function(req, res, next) {
		// Store received object properties
		const requestProperties = {
			code: req.body.code,
			userId: req.body.userId,
			workspaceURL: req.body.workspaceURL
		};

		// Load browser language from header
		const browserLng = browserResponseLng(req);

		// Validate properties in received object
		const valid = validate(requestProperties, verifyEmail());
		if (valid != null) {
			const errorMsg = new ServerResponseError(403, t("validation.verifyChangeEmailInvalidProperties", { lng: browserLng }), valid);
			return next(errorMsg);
		}

		// Validate change email code and return response
		verifyUserEmailChange(requestProperties, null, browserLng).then(
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
		"/api/v1.0/change_user_language/",
		restrict({
			registered: true,
			unregistered: false
		}),
		function(req, res, next) {
			// Store received object properties
			const requestProperties = {
				language: req.body.language
			};

			// Load browser language from header
			const browserLng = browserResponseLng(req);

			// Create user information object
			const authenticatedUser = {
				userId: req.user.userId,
				clientId: req.user.clientId
			};

			// Validate properties in received object
			const valid = validate(requestProperties, changeSavedLanguage());
			if (valid != null) {
				const errorMsg = new ServerResponseError(403, t("validation.changeLanguageInvalidProperties", { lng: browserLng }), valid);
				return next(errorMsg);
			}

			// Validate new language and return response
			changeLanguage(requestProperties, authenticatedUser, browserLng).then(
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
		"/api/v1.0/change_password/",
		restrict({
			registered: true,
			unregistered: false
		}),
		function(req, res, next) {
			// Store received object properties
			const requestProperties = {
				currentPassword: req.body.currentPassword,
				newPassword: req.body.newPassword,
				confirmPassword: req.body.confirmPassword
			};

			// Load browser language from header
			const browserLng = browserResponseLng(req);

			// Create user information object
			const authenticatedUser = {
				userId: req.user.userId,
				clientId: req.user.clientId
			};

			// Validate properties in received object
			const valid = validate(requestProperties, changeUserPassword());
			if (valid != null) {
				const errorMsg = new ServerResponseError(403, t("validation.changePasswordInvalidProperties", { lng: browserLng }), valid);
				return next(errorMsg);
			}

			// Validate new password and return response
			changePassword(requestProperties, authenticatedUser, browserLng).then(
				result => {
					return res.status(200).send(result);
				},
				error => {
					return next(error);
				}
			);
		}
	);

	// Generate a signed url to upload new profile photo
	router.get(
		"/api/v1.0/profile/generate_signed_profile_photo_url",
		restrict({
			registered: true,
			unregistered: false
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
			generateSignedProfilePhotoURL(requestProperties, authenticatedUser, browserLng).then(
				result => {
					return res.status(200).send(result);
				},
				error => {
					return next(error);
				}
			);
		}
	);

	// Save user profile photo
	router.post(
		"/api/v1.0/profile/save_profile_photo/",
		restrict({
			registered: true,
			unregistered: false
		}),
		function(req, res, next) {
			// Store received object properties
			const requestProperties = {
				key: req.body.key
			};

			// Load browser language from header
			const browserLng = browserResponseLng(req);

			// Create user information object
			const authenticatedUser = {
				userId: req.user.userId,
				clientId: req.user.clientId
			};

			// Check that the image key parameter exists
			if (requestProperties.key == null || typeof requestProperties.key !== "string") {
				const errorMsg = new ServerResponseError(403, t("validation.imageKeyInvalid", { lng: browserLng }));
				return next(errorMsg);
			}

			// Confirm that image key is of correct naming convention
			if (!keyNameCorrect(requestProperties.key)) {
				const errorMsg = new ServerResponseError(403, t("validation.imageKeyInvalid", { lng: browserLng }));
				return next(errorMsg);
			}

			// Save user profile photo and return response
			saveUserProfilePhoto(requestProperties, authenticatedUser, browserLng).then(
				result => {
					return res.status(200).send(result);
				},
				error => {
					return next(error);
				}
			);
		}
	);

	// Delete authenticated users profile photo
	router.patch(
		"/api/v1.0/profile/delete_profile_photo",
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

			// Delete user profile photo and return response
			deleteUserProfilePhoto(null, authenticatedUser, browserLng).then(
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
