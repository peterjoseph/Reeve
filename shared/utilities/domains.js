const safe = require("safe-regex");

// Validate a URL is valid
export function validateURL(href) {
	let regex = /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+(:[0-9]+)?|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)/;

	// Validate regex expression and determine if domain is valid
	if (safe(href.match(regex))) {
		const validDomain = href.match(regex);
		if (validDomain && validDomain[1]) {
			return true;
		}
	}
	return false;
}

// Extract a complete subdomain from a href url
export function extractSubdomain(href) {
	let regex = /(?:http[s]*\:\/\/)*(.*?)\.(?=[^\/]*\..{2,4})/;

	// Alternative regex for localhost development environments
	if (process.env.NODE_ENV === "development") {
		regex = /(?:http[s]*\:\/\/)*(.*?)\.(?=[^\/]*)/;
	}

	// Validate regex expression and determine if subdomain is valid
	if (safe(href.match(regex))) {
		const validDomain = href.match(regex);
		if (validDomain && validDomain[1]) {
			return validDomain[1];
		}
	}
	return "";
}
