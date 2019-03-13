import fetch from "common/fetch";

// Load User Personal Profile Details
export function loadPersonalProfile() {
	return fetch.perform("/api/profile/", {
		method: "GET"
	});
}

// Update User Personal Profile
export function updatePersonalProfile(body) {
	return fetch.perform("/api/profile/update/", {
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

// Verify User Email Change
export function verifyEmailChange(user) {
	return fetch.perform("/api/verify/email_change/", {
		method: "POST",
		body: JSON.stringify({
			code: user.code,
			userId: user.userId,
			workspaceURL: user.workspaceURL
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
