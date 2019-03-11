import fetch from "common/fetch";

// Change User Password
export function changeUserPassword(body) {
	return fetch.perform("/api/change_password/", {
		method: "POST",
		body: JSON.stringify({
			currentPassword: body.currentPassword,
			newPassword: body.newPassword,
			confirmPassword: body.confirmPassword
		})
	});
}
