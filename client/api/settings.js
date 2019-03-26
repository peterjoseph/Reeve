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
