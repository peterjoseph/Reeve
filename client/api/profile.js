import fetch from "common/fetch";

// Load User Personal Profile Details
export function loadPersonalProfile() {
	return fetch.perform("/api/v1.0/profile/", {
		method: "GET"
	});
}

// Update User Personal Profile
export function updatePersonalProfile(body) {
	return fetch.perform("/api/v1.0/profile/update/", {
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
	return fetch.perform("/api/v1.0/verify/email_change/", {
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
	return fetch.perform("/api/v1.0/change_password/", {
		method: "POST",
		body: JSON.stringify({
			currentPassword: body.currentPassword,
			newPassword: body.newPassword,
			confirmPassword: body.confirmPassword
		})
	});
}

// Generate signed S3 url to upload photo
export function generateSignedProfilePhotoURL(body) {
	return fetch.perform("/api/v1.0/profile/generate_signed_profile_photo_url/", {
		method: "GET",
		headers: {
			contentType: body.contentType
		}
	});
}

// Send file to signed S3 url
export function uploadProfilePhotoToSignedURL(body) {
	return fetch.simple(body.signedURL, {
		method: "PUT",
		headers: {
			"Content-Type": body.contentType
		},
		body: body.data
	});
}

// Upload photo to signed url and notify backend
export function saveUserProfilePhoto(body) {
	return fetch.perform("/api/v1.0/profile/save_profile_photo/", {
		method: "POST",
		body: JSON.stringify({
			key: body.key
		})
	});
}

// Delete existing user profile photo
export function deleteUserProfilePhoto() {
	return fetch.perform("/api/v1.0/profile/delete_profile_photo/", {
		method: "PATCH"
	});
}
