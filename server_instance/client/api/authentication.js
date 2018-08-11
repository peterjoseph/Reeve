import fetch from "shared/utilities/fetch";

// Account Registration
export function clientRegistration(client) {
	return fetch.perform("/internal/register/", {
		method: "POST",
		body: JSON.stringify({
			workspaceURL: client.workspaceURL,
			firstName: client.firstName,
			lastName: client.lastName,
			emailAddress: client.emailAddress,
			password: client.password,
			privacyConsent: client.privacyConsent
		})
	});
}

// User Login
export function userLogin(user) {
	let body = {
		workspaceURL: user.workspaceURL,
		emailAddress: user.emailAddress,
		password: user.password,
		keepSignedIn: user.keepSignedIn
	};
	if (user.authToken) {
		body = { authToken: user.authToken };
	}
	return fetch.perform("/internal/login/", {
		method: "POST",
		body: JSON.stringify(body)
	});
}

// Load user properties
export function userLoad() {
	return fetch.perform("/internal/load_user/", {
		method: "GET"
	});
}

// Workspace URL Validation
export function workspaceURLValidation(workspaceURL) {
	return fetch.perform("/internal/validate_workspace_url/", {
		method: "GET",
		headers: {
			workspaceURL: workspaceURL
		}
	});
}

// Forgot Account Details
export function forgotAccountDetails(user) {
	return fetch.perform("/internal/forgot_account_details/", {
		method: "POST",
		body: JSON.stringify(user)
	});
}

// Resend verify email address notification
export function resendVerifyEmail() {
	return fetch.perform("/internal/resend_verify_email/", {
		method: "POST"
	});
}

// Reset Password Code Validation
export function resetPasswordCodeValidation(reset) {
	return fetch.perform("/internal/validate_reset_password_code/", {
		method: "GET",
		headers: {
			code: reset.code,
			workspaceURL: reset.workspaceURL
		}
	});
}

// Reset User Password
export function resetPassword(reset) {
	return fetch.perform("/internal/reset_password/", {
		method: "POST",
		body: JSON.stringify({
			password: reset.password,
			verifyPassword: reset.verifyPassword,
			code: reset.code,
			workspaceURL: reset.workspaceURL
		})
	});
}
