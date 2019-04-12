import fetch from "common/fetch";

// Load Client Settings
export function loadClient() {
	return fetch.perform("/api/v1.0/settings", {
		method: "GET"
	});
}

// Update Client Settings
export function updateClient(body) {
	return fetch.perform("/api/v1.0/settings", {
		method: "PATCH",
		body: JSON.stringify(body)
	});
}

// Load Client Workspace Styling
export function loadClientStyling() {
	return fetch.perform("/api/v1.0/settings/workspace-styling", {
		method: "GET"
	});
}

// Update Client Workspace Styling
export function updateClientStyling(body) {
	return fetch.perform("/api/v1.0/settings/workspace-styling", {
		method: "PATCH",
		body: JSON.stringify(body)
	});
}

// Reset Client Workspace Styling
export function resetClientStyling() {
	return fetch.perform("/api/v1.0/settings/reset-workspace-styling", {
		method: "POST"
	});
}

// Generate signed S3 url to client styling photo
export function generateSignedPhotoURL(body) {
	return fetch.perform("/api/v1.0/settings/generate-signed-photo-url", {
		method: "GET",
		headers: {
			contentType: body.contentType
		}
	});
}

// Send file to signed S3 url
export function uploadPhotoToSignedURL(body) {
	return fetch.simple(body.signedURL, {
		method: "PUT",
		headers: {
			"Content-Type": body.contentType
		},
		body: body.data
	});
}

// Load Localization Settings
export function loadLocalization() {
	return fetch.perform("/api/v1.0/settings/localization", {
		method: "GET"
	});
}

// Update Localization Settings
export function updateLocalization(body) {
	return fetch.perform("/api/v1.0/settings/localization", {
		method: "PATCH",
		body: JSON.stringify(body)
	});
}

// Delete Workspace
export function deleteWorkspace(body) {
	return fetch.perform("/api/v1.0/settings/delete-workspace", {
		method: "POST",
		body: JSON.stringify({
			workspaceURL: body.workspaceURL,
			accountPassword: body.accountPassword
		})
	});
}
