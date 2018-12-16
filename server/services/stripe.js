let config = require("../../config");
const stripe = require("stripe")(config.stripe.secretKey);

function initialize(app) {
	if (!config.stripe.enabled) {
		return;
	}
}

module.exports = {
	initialize: initialize
};
