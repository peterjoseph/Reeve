import validate from "shared/validation/validate";
import { register, login, forgot, workspaceURL, verifyResetPassword, resetPassword, verifyEmail } from "shared/validation/authentication";
import { t } from "shared/translations/i18n";
import { ServerResponseError } from "utilities/errors/serverResponseError";
import restrict from "utilities/restrictRoutes";
import browserResponseLng from "utilities/browserResponseLng";
import { variableExists } from "shared/utilities/filters";
import {
	validateWorkspaceURL,
	registerNewClient,
	authenticateWithJWTStrategy,
	authenticateWithLocalStrategy,
	loadUserProperties,
	deleteSession,
	resendVerifyEmail,
	forgotAccountEmail,
	forgotAccountPasswordEmail,
	validateResetPasswordCode,
	resetUserPassword,
	verifyUserEmail
} from "../orchestrator/authentication";

module.exports = function(router) {
	// Validate Workspace URL
	router.get("/api/v1.0/authentication/validate-workspace-url", restrict({ registered: true, unregistered: true }), function(req, res, next) {
		// Get workspaceURL name from header
		const workspaceURL = req.headers["workspaceurl"] ? req.headers["workspaceurl"] : "";

		// Load browser language from header
		const browserLng = browserResponseLng(req);

		// Store workspaceURL in new object
		const requestProperties = {
			workspaceURL: workspaceURL
		};

		// Validate header item exists
		if (!variableExists(requestProperties.workspaceURL)) {
			const error = new ServerResponseError(403, t("validation.clientInvalidProperties", { lng: browserLng }), { workspaceURL: [t("validation.emptyWorkspaceURL", { lng: browserLng })] });
			return next(error);
		}

		// Validate workspaceURL and return response
		validateWorkspaceURL(requestProperties, null, browserLng).then(
			result => {
				return res.status(200).send(result);
			},
			error => {
				return next(error);
			}
		);
	});

	// Register New Client Account
	router.post("/api/v1.0/authentication/register", restrict({ unregistered: true }), function(req, res, next) {
		// Store received object properties
		const requestProperties = {
			workspaceURL: req.body.workspaceURL,
			firstName: req.body.firstName,
			lastName: req.body.lastName,
			emailAddress: req.body.emailAddress,
			password: req.body.password,
			privacyConsent: req.body.privacyConsent,
			language: req.body.language
		};

		// Load browser language from header
		const browserLng = browserResponseLng(req);

		// Validate properties in received object
		const valid = validate(requestProperties, register());
		if (valid != null) {
			const errorMsg = new ServerResponseError(403, t("validation.clientInvalidProperties", { lng: browserLng }), valid);
			return next(errorMsg);
		}

		// Register new client and return response
		registerNewClient(requestProperties, null, browserLng).then(
			result => {
				return res.status(200).send(result);
			},
			error => {
				return next(error);
			}
		);
	});

	// Login to user account
	router.post("/api/v1.0/authentication/login", restrict({ unregistered: true, registered: true }), function(req, res, next) {
		// Load browser language from header
		const browserLng = browserResponseLng(req);

		// Authenticate with token if authToken exists
		if (variableExists(req.body.authToken) && req.body.authToken === true) {
			authenticateWithJWTStrategy(req, res, next, browserLng);
			return;
		}

		// Authenticate with user properties sent in body
		const requestProperties = {
			workspaceURL: req.body.workspaceURL,
			emailAddress: req.body.emailAddress,
			password: req.body.password,
			keepSignedIn: req.body.keepSignedIn
		};

		// Validate properties in received object
		const valid = validate(requestProperties, login());
		if (valid != null) {
			const errorMsg = new ServerResponseError(403, t("validation.userInvalidProperties", { lng: browserLng }), valid);
			return next(errorMsg);
		}

		// Authenticate using local authentication strategy (username & password)
		authenticateWithLocalStrategy(req, res, next, browserLng);
	});

	// Logout of user account
	router.post("/api/v1.0/authentication/logout", restrict({ registered: true }), function(req, res, next) {
		// Load browser language from header
		const browserLng = browserResponseLng(req);

		// Load user properties from session
		const authenticatedUser = req.user;

		deleteSession(null, authenticatedUser, browserLng).then(
			result => {
				return res.status(200).send(result);
			},
			error => {
				return next(error);
			}
		);
	});

	// Load user properties
	router.get("/api/v1.0/authentication/load-user", restrict({ registered: true }), function(req, res, next) {
		// Load browser language from header
		const browserLng = browserResponseLng(req);

		// Load user properties from session
		const authenticatedUser = req.user;

		loadUserProperties(null, authenticatedUser, browserLng).then(
			result => {
				return res.status(200).send(result);
			},
			error => {
				return next(error);
			}
		);
	});

	// Resend verify email address email
	router.post("/api/v1.0/authentication/resend-verify-email", restrict({ registered: true }), function(req, res, next) {
		// Load browser language from header
		const browserLng = browserResponseLng(req);

		// Create user information object
		const authenticatedUser = {
			userId: req.user.userId,
			clientId: req.user.clientId
		};

		if (!variableExists(authenticatedUser.userId) || !Number.isInteger(authenticatedUser.userId)) {
			const errorMsg = new ServerResponseError(403, t("validation.invalidUserId", { lng: browserLng }), null);
			return next(errorMsg);
		}

		resendVerifyEmail(null, authenticatedUser, browserLng).then(
			result => {
				return res.status(200).send(result);
			},
			error => {
				return next(error);
			}
		);
	});

	// Forgot account details password request
	router.post("/api/v1.0/authentication/forgot-account-details", restrict({ unregistered: true }), function(req, res, next) {
		// Authenticate with user properties sent in body
		const requestProperties = {
			emailAddress: req.body.emailAddress
		};

		// Append workspaceURL to body object if it exists
		if (variableExists(req.body.workspaceURL)) {
			Object.assign(requestProperties, { workspaceURL: req.body.workspaceURL });
		}

		// Load browser language from header
		const browserLng = browserResponseLng(req);

		// Validate email address
		const valid = validate(requestProperties, forgot());
		if (valid != null) {
			const errorMsg = new ServerResponseError(403, t("validation.userInvalidProperties", { lng: browserLng }), valid);
			return next(errorMsg);
		}

		// If workspace name is invalid, remove it from the requestProperties object
		if (variableExists(requestProperties.workspaceURL)) {
			const validWorkspaceURL = validate(requestProperties, workspaceURL());
			if (validWorkspaceURL != null) {
				delete requestProperties.workspaceURL;
			}
		}

		// Orchestrate workspace or password email depending on whether workspaceURL is provided
		if (variableExists(requestProperties.workspaceURL)) {
			forgotAccountPasswordEmail(requestProperties, null, browserLng).then(
				result => {
					return res.status(200).send(result);
				},
				error => {
					return next(error);
				}
			);
		} else {
			forgotAccountEmail(requestProperties, null, browserLng).then(
				result => {
					return res.status(200).send(result);
				},
				error => {
					return next(error);
				}
			);
		}
	});

	// Confirm a supplied reset password code is valid
	router.get("/api/v1.0/authentication/validate-reset-password-code", restrict({ unregistered: true }), function(req, res, next) {
		// Get reset password code and workspaceURL from header
		const resetCode = req.headers["code"] ? req.headers["code"] : "";
		const workspaceURL = req.headers["workspaceurl"] ? req.headers["workspaceurl"] : "";

		// Load browser language from header
		const browserLng = browserResponseLng(req);

		// Validate header item exists
		if (!variableExists(resetCode)) {
			const error = new ServerResponseError(403, t("validation.resetPasswordInvalidProperties", { lng: browserLng }), { code: [t("validation.emptyResetCode", { lng: browserLng })] });
			return next(error);
		}

		// Build header object
		const requestProperties = {
			workspaceURL: workspaceURL,
			code: resetCode
		};

		// Validate header item exists
		const valid = validate(requestProperties, verifyResetPassword());
		if (valid != null) {
			const error = new ServerResponseError(403, t("validation.resetPasswordInvalidProperties", { lng: browserLng }), valid);
			return next(error);
		}

		// Validate reset password code and return response
		validateResetPasswordCode(requestProperties, null, browserLng).then(
			result => {
				return res.status(200).send(result);
			},
			error => {
				return next(error);
			}
		);
	});

	// Reset user password
	router.post("/api/v1.0/authentication/reset-password", restrict({ unregistered: true }), function(req, res, next) {
		// Store received object properties
		const requestProperties = {
			password: req.body.password,
			verifyPassword: req.body.verifyPassword,
			code: req.body.code,
			workspaceURL: req.body.workspaceURL
		};

		// Load browser language from header
		const browserLng = browserResponseLng(req);

		// Validate properties in received object
		const valid = validate(requestProperties, resetPassword());
		if (valid != null) {
			const errorMsg = new ServerResponseError(403, t("validation.resetPasswordInvalidProperties", { lng: browserLng }), valid);
			return next(errorMsg);
		}

		// Validate reset password code and return response
		resetUserPassword(requestProperties, null, browserLng).then(
			result => {
				return res.status(200).send(result);
			},
			error => {
				return next(error);
			}
		);
	});

	// Verify User Email
	router.post("/api/v1.0/authentication/verify-email", restrict({ registered: true, unregistered: true }), function(req, res, next) {
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
			const errorMsg = new ServerResponseError(403, t("validation.verifyEmailInvalidProperties", { lng: browserLng }), valid);
			return next(errorMsg);
		}

		// Validate verify email code and return response
		verifyUserEmail(requestProperties, null, browserLng).then(
			result => {
				return res.status(200).send(result);
			},
			error => {
				return next(error);
			}
		);
	});
};
