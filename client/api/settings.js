import fetch from "common/fetch";

// Load Client Details
export function loadClient() {
	return fetch.perform("/api/v1.0/client", {
		method: "GET"
	});
}

// Update Client Details
export function updateClient(body) {
	return fetch.perform("/api/v1.0/client", {
		method: "PATCH",
		body: JSON.stringify(body)
	});
}

// Load Client Styling
export function loadClientStyling() {
	return fetch.perform("/api/v1.0/client/styling", {
		method: "GET"
	});
}

// Update Client Styling
export function updateClientStyling(body) {
	return fetch.perform("/api/v1.0/client/styling", {
		method: "PATCH",
		body: JSON.stringify(body)
	});
}

// Generate signed S3 url to client styling photo
export function generateSignedPhotoURL(body) {
	return fetch.perform("/api/v1.0/client/styling/generate_signed_photo_url", {
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
	return fetch.perform("/api/v1.0/settings/delete_workspace", {
		method: "POST",
		body: JSON.stringify({
			workspaceURL: body.workspaceURL,
			accountPassword: body.accountPassword
		})
	});
}
