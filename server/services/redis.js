let session = require("express-session");
let SessionRedisStore = require("connect-redis")(session);
let RateLimit = require("express-rate-limit");
let RateLimitRedisStore = require("rate-limit-redis");
let redisClient = require("redis");
let config = require("../../config");

let redisInterface = redisClient.createClient({
	host: config.redis.host,
	port: config.redis.port,
	password: config.redis.pass
});

let redisSessionStore = null;
let redisRateLimitStore = null;

function initialize(app) {
	// Create Session Store
	redisSessionStore = new SessionRedisStore({ client: redisInterface });

	// Create Rate Limit Store
	redisRateLimitStore = new RateLimitRedisStore({ client: redisInterface });

	// Connection to Redis user session store
	app.use(
		session({
			store: redisSessionStore,
			secret: config.redis.secret,
			proxy: config.redis.proxy,
			resave: config.redis.resave,
			saveUninitialized: config.redis.saveUninitialized,
			ttl: config.redis.ttl
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
