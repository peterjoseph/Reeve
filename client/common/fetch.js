import { activeLanguage } from "shared/translations/i18n";
import { CLIENT_INFORMATION } from "shared/constants";

// Async function for handling front-end get, post and patch calls
export default {
	async execute(path, options) {
		const route = `${BUILD_PROTOCOL}://${BUILD_DOMAINPATH}${path}`;
		// Set default headers
		options.headers = Object.assign(
			{
				Accept: "application/json",
				Pragma: "no-cache",
				"Content-Type": "application/json",
				"Accept-Language": activeLanguage() || "",
				"X-Client-Type": CLIENT_INFORMATION.TYPE,
				"X-Client-Version": CLIENT_INFORMATION.VERSION
			},
			options.headers || {}
		);

		// Add security token to header
		if (this.token != null) {
			options.headers = Object.assign(options.headers, {
				Authorization: `jwt ${this.token}`
			});
		}

		// Perform fetch on the endpoint
		const response = await fetch(route, options);

		// Handle server side redirects
		if (response.redirected) {
			return window.location.replace(response.url);
		}

		// Valid response if status 200 ~ 299
		let json = response.json();
		if (response.status >= 200 && response.status < 300) {
			return json;
		}

		// Throw error if any other response from server
		return json.then(error => {
			throw error;
		});
	},

	// Set Security Token Header
	setSecurityToken(token) {
		this.token = token;
	},

	getSecurityToken() {
		return this.token;
	},

	clearSecurityToken() {
		this.token = null;
	},

	// Set Accept Language Header
	setLanguageToken(language) {
		this.language = language;
	},

	getLanguageToken() {
		return this.language;
	},

	clearLanguageToken() {
		this.language = null;
	},

	// Complex fetch with headers
	perform(path, options = {}) {
		return this.execute(path, options);
	},

	// Simple fetch method without all the headers
	async simple(path, options = {}) {
		// Perform fetch on the endpoint
		const response = await fetch(path, options);

		// Valid response if status 200 ~ 299
		if (response.status >= 200 && response.status < 300) {
			return response;
		}

		// Throw error if any other response from server
		return response.then(error => {
			throw error;
		});
	}
};
