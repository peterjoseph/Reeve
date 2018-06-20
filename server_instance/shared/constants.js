module.exports = Object.freeze({
	SERVER_DETAILS: {
		PROTOCOL: "http",
		DOMAIN: "localhost:3000",
		MINIMUM_BROWSER_VERSIONS: {
			msie: "11",
			msedge: "16",
			firefox: "45",
			chrome: "59",
			safari: "10",
			opera: "46",
			ios: "11",
			android: "5.0"
		}
	},
	FEATURES: {
		STYLING: 1
	},
	ROLE_TYPE: {
		UNREGISTERED: 0,
		OWNER: 1,
		ADMINISTRATOR: 2
	},
	SUBSCRIPTION_TYPE: {
		TRIAL: 1
	},
	REDUX_STATE: {
		PENDING: "PENDING",
		FULFILLED: "FULFILLED",
		REJECTED: "REJECTED"
	}
});
