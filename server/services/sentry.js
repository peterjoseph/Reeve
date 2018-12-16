let config = require("../../config");

function initialize(app) {
	if (!config.sentry.enabled && config.build.environment !== "production") {
		return;
	}

	let raven = require("raven");
	raven.config(config.sentry.dns).install();
	app.use(raven.requestHandler());
	app.use(raven.errorHandler());
}

module.exports = {
	initialize: initialize
};
