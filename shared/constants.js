module.exports = Object.freeze({
	MINIMUM_BROWSER_VERSIONS: {
		msie: "11",
		msedge: "16",
		firefox: "45",
		chrome: "59",
		safari: "10",
		opera: "46",
		ios: "11",
		android: "5.0"
	},
	FEATURES: {
		STYLING: 1,
		BILLING: 2
	},
	ROLE_TYPE: {
		UNREGISTERED: 0,
		OWNER: 1,
		ADMINISTRATOR: 2,
		FINANCE: 3
	},
	SUBSCRIPTION_TYPE: {
		TRIAL: 1,
		BASIC: 2
	},
	BILLING_CYCLE: {
		TRIAL: 14,
		BASIC: 28
	},
	EMAIL_TYPE: {
		CLIENT_WELCOME: 1,
		RESEND_VERIFY_EMAIL: 2,
		FORGOT_ACCOUNT_DETAILS: 3,
		FORGOT_PASSWORD: 4,
		RESET_PASSWORD_SUCCESS: 5
	},
	LANGUAGE: {
		ENGLISH: 1,
		ITALIAN: 2
	},
	LANGUAGE_CODES: {
		1: "en",
		2: "it"
	},
	REDUX_STATE: {
		PENDING: "PENDING",
		FULFILLED: "FULFILLED",
		REJECTED: "REJECTED"
	},
	PAYMENT_CURRENCY: {
		AUD: 1
	},
	PAYMENT_CURRENCY_CODES: {
		1: "aud"
	},
	PAYMENT_INTERVALS: {
		MONTH: 1,
		YEAR: 2
	},
	PAYMENT_INTERVALS_CODES: {
		1: "month",
		2: "year"
	},
	RESTRICTED_LANGUAGES: ["en", "it"],
	RESTRICTED_DOMAINS: [
		"domain",
		"account",
		"accounts",
		"admin",
		"registration",
		"signup",
		"configuration",
		"web",
		"mobile",
		"app",
		"software",
		"com",
		"net",
		"org",
		"login",
		"register",
		"account",
		"app",
		"reeve",
		"member",
		"membership"
	]
});
