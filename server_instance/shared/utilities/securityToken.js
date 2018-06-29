// Store security token in browser
export function saveToken(securityToken, keepSignedIn) {
	if (keepSignedIn === true) {
		window.localStorage.setItem("securityToken", JSON.stringify(securityToken));
	} else {
		window.sessionStorage.setItem("securityToken", JSON.stringify(securityToken));
	}
}

// Clear security token from browser
export function clearToken() {
	window.localStorage.removeItem("securityToken");
	window.sessionStorage.removeItem("securityToken");
}

// Retrieve security token from browser
export function getToken() {
	const token = window.sessionStorage.getItem("securityToken") || window.localStorage.getItem("securityToken");
	return JSON.parse(token);
}
