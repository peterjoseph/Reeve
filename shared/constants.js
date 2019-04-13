module.exports = Object.freeze({
	CLIENT_INFORMATION: {
		TYPE: "Desktop",
		VERSION: "1.2.0"
	},
	MINIMUM_BROWSER_VERSIONS: {
		msie: ">11",
		msedge: ">16",
		firefox: ">45",
		chrome: ">59",
		safari: ">10",
		opera: ">46",
		ios: ">11",
		android: ">5.0"
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
		BASIC: 2,
		STANDARD: 3,
		PROFESSIONAL: 4
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
		RESET_PASSWORD_SUCCESS: 5,
		CHANGE_PASSWORD_SUCCESS: 6,
		CHANGE_EMAIL_ADDRESS: 7,
		CHANGE_EMAIL_ADDRESS_SUCCESS: 8
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
	MAX_FILE_UPLOAD_SIZE: {
		CHANGE_AVATAR: "256kb",
		LOGO_IMAGE: "256kb",
		BACKGROUND_IMAGE: "512kb"
	},
	SIGNED_URL_EXPIRY_TIME: {
		CHANGE_AVATAR: 120,
		DISPLAY_AVATAR: 240,
		DISPLAY_CLIENT_STYLING_IMAGES: 60,
		CHANGE_CLIENT_STYLING_IMAGES: 240
	},
	ACL_POLICIES: {
		PUBLIC_READ: "public-read"
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
