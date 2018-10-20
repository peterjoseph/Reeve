import { SERVER_DETAILS } from "shared/constants";

// Base URL without workspace name
export function baseURL() {
	return `${SERVER_DETAILS.PROTOCOL}://${SERVER_DETAILS.DOMAIN}/`;
}

// Custom Path
export function customPathURL(path) {
	return `${SERVER_DETAILS.PROTOCOL}://${SERVER_DETAILS.DOMAIN}${path}`;
}

// Registration Page
export function registerURL() {
	return `${SERVER_DETAILS.PROTOCOL}://${SERVER_DETAILS.DOMAIN}/register`;
}

// Registration successful Query
export function registerSuccessURL(workspaceURL) {
	return `${SERVER_DETAILS.PROTOCOL}://${workspaceURL}.${SERVER_DETAILS.DOMAIN}/signin?registration=success`;
}

// Base home URL with workspace
export function baseWorkspaceURL(workspaceURL) {
	return `${SERVER_DETAILS.PROTOCOL}://${workspaceURL}.${SERVER_DETAILS.DOMAIN}/`;
}

// SignIn Page
export function signinURL(workspaceURL) {
	return `${SERVER_DETAILS.PROTOCOL}://${workspaceURL}.${SERVER_DETAILS.DOMAIN}/signin`;
}

// Billing Page
export function billingURL(workspaceURL) {
	return `${SERVER_DETAILS.PROTOCOL}://${workspaceURL}.${SERVER_DETAILS.DOMAIN}/billing`;
}

// Reset Password
export function resetPasswordURL(workspaceURL, resetCode) {
	return `${SERVER_DETAILS.PROTOCOL}://${workspaceURL}.${SERVER_DETAILS.DOMAIN}/reset#code=${resetCode}`;
}

// Email Validation Link
export function emailValidationURL(workspaceURL, validationCode) {
	return `${SERVER_DETAILS.PROTOCOL}://${workspaceURL}.${SERVER_DETAILS.DOMAIN}/verify#code=${validationCode}`;
}
