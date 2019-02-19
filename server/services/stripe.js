let config = require("../../config");
const stripe = require("stripe")(config.stripe.apiKey);

function initialize(app) {
	if (!config.stripe.enabled) {
		return;
	}
}

module.exports = {
	initialize: initialize
};
