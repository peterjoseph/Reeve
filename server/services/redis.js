let session = require("express-session");
let SessionRedisStore = require("connect-redis")(session);
let RateLimit = require("express-rate-limit");
let RateLimitRedisStore = require("rate-limit-redis");
let config = require("../../config");

let redisSessionStore = null;
let redisRateLimitStore = null;

function initialize(app) {
	// Create Session Store
	redisSessionStore = new SessionRedisStore({
		host: config.redis.host,
		port: config.redis.port,
		pass: config.redis.pass
	});

	// Create Rate Limit Store
	redisRateLimitStore = new RateLimitRedisStore({
		host: config.redis.host,
		port: config.redis.port,
		pass: config.redis.pass
	});

	// Connection to Redis user session store
	app.use(
		session({
			store: redisSessionStore,
			secret: config.redis.secret,
			proxy: false,
			resave: config.redis.resave,
			saveUninitialized: false,
			ttl: 2 * 604800
		})
	);

	// Add rate limiting to endpoints to prevent excessive use
	app.enable("trust proxy");
	var apiLimiter = new RateLimit({
		store: redisRateLimitStore,
		windowMs: 15 * 60 * 1000,
		max: 100,
		delayMs: 0
	});
	app.use(apiLimiter);

	// Handle Redis connection failure
	app.use(function(req, res, next) {
		if (!req.session) {
			process.stdout.write("Unable to connect to Redis session store\n");
			process.exit(1);
		}
		next();
	});
}

module.exports = {
	initialize: initialize
};
