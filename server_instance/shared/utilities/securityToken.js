// Store security token in browser
export function saveToken(securityToken) {
	localStorage.setItem("securityToken", JSON.stringify(securityToken));
	return JSON.parse(localStorage.getItem("securityToken")) === securityToken;
}

// Clear security token from browser
export function clearToken() {
	localStorage.removeItem("securityToken");
	localStorage.clear();
	sessionStorage.clear();
	return JSON.parse(localStorage.getItem("securityToken")) === null;
}

// Retrieve security token from browser
export function getToken() {
	return JSON.parse(localStorage.getItem("securityToken"));
}
