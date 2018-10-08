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
	authenticateWithToken,
	authenticateWithoutToken,
	loadUser,
	resendVerifyEmail,
	forgotAccountEmail,
	forgotAccountPasswordEmail,
	validateResetPasswordCode,
	resetUserPassword,
	verifyUserEmail
} from "../orchestrator/authentication";

module.exports = function(router) {
	// Validate Workspace URL
	router.get("/internal/validate_workspace_url/", restrict({ registered: true, unregistered: true }), function(req, res, next) {
		// Get workspaceURL name from header
		const workspaceURL = req.headers["workspaceurl"] ? req.headers["workspaceurl"] : "";

		// Load browser language from header
		const browserLng = browserResponseLng(req);

		// Validate header item exists
		if (!variableExists(workspaceURL)) {
			const error = new ServerResponseError(403, t("validation.clientInvalidProperties", { lng: browserLng }), { workspaceURL: [t("validation.emptyWorkspaceURL", { lng: browserLng })] });
			return next(error);
		}

		// Validate workspaceURL and return response
		validateWorkspaceURL(workspaceURL, browserLng).then(
			result => {
				return res.status(200).send(result);
			},
			error => {
				return next(error);
			}
		);
	});

	// Register New Client Account
	router.post("/internal/register", restrict({ unregistered: true }), function(req, res, next) {
		// Store received object properties
		const body = {
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
		const valid = validate(body, register());
		if (valid != null) {
			const errorMsg = new ServerResponseError(403, t("validation.clientInvalidProperties", { lng: browserLng }), valid);
			return next(errorMsg);
		}

		// Register new client and return response
		registerNewClient(body, browserLng).then(
			result => {
				return res.status(200).send(result);
			},
			error => {
				return next(error);
			}
		);
	});

	// Login to user account
	router.post("/internal/login", restrict({ unregistered: true, registered: true }), function(req, res, next) {
		// Load browser language from header
		const browserLng = browserResponseLng(req);

		// Authenticate with token if authToken exists
		if (variableExists(req.body.authToken) && req.body.authToken === true) {
			authenticateWithToken(req, res, next, browserLng);
			return;
		}

		// Authenticate with user properties sent in body
		const body = {
			workspaceURL: req.body.workspaceURL,
			emailAddress: req.body.emailAddress,
			password: req.body.password,
			keepSignedIn: req.body.keepSignedIn
		};

		// Validate properties in received object
		const valid = validate(body, login());
		if (valid != null) {
			const errorMsg = new ServerResponseError(403, t("validation.userInvalidProperties", { lng: browserLng }), valid);
			return next(errorMsg);
		}

		// Authenticate without token
		authenticateWithoutToken(body, browserLng).then(
			result => {
				return res.status(200).send(result);
			},
			error => {
				return next(error);
			}
		);
	});

	// Logout of user account
	router.post("/internal/logout/", restrict({ registered: true }), function(req, res) {
		// Destroy the session
		req.session.destroy();

		return res.status(200).send({ status: 200, message: t("label.success") });
	});

	// Load user properties
	router.get("/internal/load_user/", restrict({ registered: true }), function(req, res, next) {
		// Load browser language from header
		const browserLng = browserResponseLng(req);

		loadUser(req.user, browserLng).then(
			result => {
				return res.status(200).send(result);
			},
			error => {
				return next(error);
			}
		);
	});

	// Resend verify email address email
	router.post("/internal/resend_verify_email/", restrict({ registered: true }), function(req, res, next) {
		// Load browser language from header
		const browserLng = browserResponseLng(req);

		if (!variableExists(req.user.userId) || !Number.isInteger(req.user.userId)) {
			const errorMsg = new ServerResponseError(403, t("validation.invalidUserId", { lng: browserLng }), null);
			return next(errorMsg);
		}

		resendVerifyEmail(req.user.userId, req.user.clientId, browserLng).then(
			result => {
				return res.status(200).send(result);
			},
			error => {
				return next(error);
			}
		);
	});

	// Forgot account details password request
	router.post("/internal/forgot_account_details/", restrict({ unregistered: true }), function(req, res, next) {
		// Authenticate with user properties sent in body
		const body = {
			emailAddress: req.body.emailAddress
		};

		// Append workspaceURL to body object if it exists
		if (variableExists(req.body.workspaceURL)) {
			Object.assign(body, { workspaceURL: req.body.workspaceURL });
		}

		// Load browser language from header
		const browserLng = browserResponseLng(req);

		// Validate email address
		const valid = validate(body, forgot());
		if (valid != null) {
			const errorMsg = new ServerResponseError(403, t("validation.userInvalidProperties", { lng: browserLng }), valid);
			return next(errorMsg);
		}

		// If workspace name is invalid, remove it from the body object
		if (variableExists(body.workspaceURL)) {
			const validWorkspaceURL = validate(body, workspaceURL());
			if (validWorkspaceURL != null) {
				delete body.workspaceURL;
			}
		}

		// Orchestrate workspace or password email depending on whether workspaceURL is provided
		if (variableExists(body.workspaceURL)) {
			forgotAccountPasswordEmail(body, browserLng).then(
				result => {
					return res.status(200).send(result);
				},
				error => {
					return next(error);
				}
			);
		} else {
			forgotAccountEmail(body, browserLng).then(
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
	router.get("/internal/validate_reset_password_code/", restrict({ unregistered: true }), function(req, res, next) {
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
		const header = {
			workspaceURL: workspaceURL,
			code: resetCode
		};

		// Validate header item exists
		const valid = validate(header, verifyResetPassword());
		if (valid != null) {
			const error = new ServerResponseError(403, t("validation.resetPasswordInvalidProperties", { lng: browserLng }), valid);
			return next(error);
		}

		// Validate reset password code and return response
		validateResetPasswordCode(header, browserLng).then(
			result => {
				return res.status(200).send(result);
			},
			error => {
				return next(error);
			}
		);
	});

	// Reset user password
	router.post("/internal/reset_password/", restrict({ unregistered: true }), function(req, res, next) {
		// Store received object properties
		const body = {
			password: req.body.password,
			verifyPassword: req.body.verifyPassword,
			code: req.body.code,
			workspaceURL: req.body.workspaceURL
		};

		// Load browser language from header
		const browserLng = browserResponseLng(req);

		// Validate properties in received object
		const valid = validate(body, resetPassword());
		if (valid != null) {
			const errorMsg = new ServerResponseError(403, t("validation.resetPasswordInvalidProperties", { lng: browserLng }), valid);
			return next(errorMsg);
		}

		// Validate reset password code and return response
		resetUserPassword(body, browserLng).then(
			result => {
				return res.status(200).send(result);
			},
			error => {
				return next(error);
			}
		);
	});

	// Verify User Email
	router.post("/internal/verify_email/", restrict({ registered: true, unregistered: true }), function(req, res, next) {
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
			const errorMsg = new ServerResponseError(403, t("validation.verifyEmailInvalidProperties", { lng: browserLng }), valid);
			return next(errorMsg);
		}

		// Validate reset password code and return response
		verifyUserEmail(body, browserLng).then(
			result => {
				return res.status(200).send(result);
			},
			error => {
				return next(error);
			}
		);
	});
};
