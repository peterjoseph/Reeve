import fetch from "common/fetch";

// Change User Language
export function changeUserLanguage(body) {
	return fetch.perform("/api/v1.0/language/change-user-language", {
		method: "POST",
		body: JSON.stringify({
			language: body.language
		})
	});
}
