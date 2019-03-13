import fetch from "common/fetch";

// Load User Personal Profile Details
export function loadPersonalProfile() {
	return fetch.perform("/api/profile/", {
		method: "GET",
	});
}

// Update User Personal Profile
export function updatePersonalProfile(body) {
	return fetch.perform("/api/update_profile/", {
		method: "POST",
		body: JSON.stringify({
			firstName: body.firstName,
			lastName: body.lastName,
			emailAddress: body.emailAddress,
			bio: body.bio,
			location: body.location,
			website: body.website
		})
	});
}

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
