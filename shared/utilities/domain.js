const safe = require("safe-regex");

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
