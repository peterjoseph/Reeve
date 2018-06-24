import fetch from "~/shared/utilities/fetch";

// Account Registration
export function clientRegistration(client) {
	return fetch.perform("/internal/register/", {
		method: "POST",
		body: JSON.stringify({
			workspaceURL: client.workspaceURL,
			firstName: client.firstName,
			lastName: client.lastName,
			emailAddress: client.emailAddress,
			password: client.password
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

// Workspace URL Validation
export function workspaceURLValidation(workspaceURL) {
	return fetch.perform("/internal/validate_workspace_url/", {
		method: "GET",
		headers: {
			workspaceURL: workspaceURL
		}
	});
}
