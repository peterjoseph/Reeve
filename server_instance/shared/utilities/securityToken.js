// Store security token in browser
export function saveToken(securityToken, keepSignedIn) {
	if (keepSignedIn === true) {
		localStorage.setItem("securityToken", JSON.stringify(securityToken));
	} else {
		sessionStorage.setItem("securityToken", JSON.stringify(securityToken));
	}
}

// Clear security token from browser
export function clearToken() {
	localStorage.removeItem("securityToken");
	sessionStorage.removeItem("securityToken");
	localStorage.clear();
	sessionStorage.clear();
}

// Retrieve security token from browser
export function getToken() {
	return JSON.parse(sessionStorage.getItem("securityToken") || localStorage.getItem("securityToken"));
}
