let winston = require("winston");
let expressWinston = require("express-winston");
let config = require("../../config");

let logger = null;

function initialize(app) {
	if (!config.papertrail.enabled) {
		return;
	}

	let WinstonPapertrail = require("winston-papertrail").Papertrail;
	const PTtransport = new WinstonPapertrail({
		host: config.papertrail.host,
		port: config.papertrail.port,
		hostname: config.papertrail.hostname,
		level: config.papertrail.level,
		handleExceptions: true,
		logFormat: function(level, message) {
			return "[" + level + "] " + message;
		}
	});

	// Connect express to Papertrail Logging
	app.use(
		expressWinston.logger({
			transports: [PTtransport],
			meta: false,
			msg:
				"{{req.ip}} - {{res.statusCode}} - {{req.method}} - {{res.responseTime}}ms - URL: {{req.url}} - ORIGINAL URL: {{req.originalUrl}} - HOST: {{req.headers['host']}} - ORIGIN: {{req.headers['origin']}} - REFERER: {{req.headers['referer']}} - USER AGENT: {{req.headers['user-agent']}}",
			expressFormat: false,
			colorize: true,
			ignoreRoute: function(req, res) {
				return false;
			}
		})
	);

	logger = new winston.Logger({
		transports: [PTtransport]
	});

	PTtransport.on("error", function(err) {
		logger && logger.error(err);
	});

	PTtransport.on("connect", function(message) {
		logger && logger.info(message);
	});
}

function logging() {
	if (!config.papertrail.enabled) {
		return;
	}

	return logger;
}

module.exports = {
	initialize: initialize,
	logging: logging
};
