module.exports = {
	SERVER_DETAILS: Object.freeze({
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
	}),

	FEATURES: Object.freeze({
		STYLING: 1
	}),

	ROLE_TYPE: Object.freeze({
		UNREGISTERED: 0,
		OWNER: 1,
		ADMINISTRATOR: 2
	}),

	SUBSCRIPTION_TYPE: Object.freeze({
		TRIAL: 1
	}),

	REDUX_STATE: Object.freeze({
		PENDING: "PENDING",
		FULFILLED: "FULFILLED",
		REJECTED: "REJECTED"
	})
};
