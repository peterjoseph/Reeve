let util = require("util");
let redisClient = require("redis");
let RateLimit = require("express-rate-limit");
let RateLimitRedisStore = require("rate-limit-redis");
let config = require("../../config");

// Redis interface variables
let redisInterface = null;
let redisRateLimitStore = null;

let getAsync = null;
let delAsync = null;

// Initialize the redis connection
function initialize(app) {
	if (!config.redis.enabled) {
		return;
	}

	// Load redis client
	redisInterface = redisClient.createClient({
		host: config.redis.host,
		port: config.redis.port,
		password: config.redis.pass,
		retry_strategy: function(options) {
			if (options.error && options.error.code === "ECONNREFUSED") {
				process.stdout.write("ECONNREFUSED: Unable to connect to Redis server\n");
				process.exit(1);
			}
			if (options.total_retry_time > 1000 * 60 * 60) {
				process.stdout.write("Redis: Retry time exhausted\n");
				process.exit(1);
			}
			if (options.attempt > 10) {
				process.stdout.write("Redis: Connection attempts exhausted\n");
				process.exit(1);
			}
			return Math.min(options.attempt * 100, 3000);
		}
	});

	// Add promises functionality to specific redis client functions
	getAsync = util.promisify(redisInterface.get).bind(redisInterface);
	delAsync = util.promisify(redisInterface.del).bind(redisInterface);

	// Create Rate Limit Store
	redisRateLimitStore = new RateLimitRedisStore({ client: redisInterface });

	// Add rate limiting to endpoints to prevent excessive use
	app.enable("trust proxy");
	var apiLimiter = new RateLimit({
		store: redisRateLimitStore,
		windowMs: 15 * 60 * 1000,
		max: 200,
		delayMs: 0
	});
	app.use(apiLimiter);
}

// Retrieve key and value from Redis store
function getKey(key) {
	if (!config.redis.enabled) {
		return;
	}

	return getAsync(key);
}

// Add key and value to Redis store
function setKey(key, value, expiry) {
	if (!config.redis.enabled) {
		return;
	}

	return redisInterface.set(key, value, "EX", expiry);
}

// Delete existing key from Redis store
function deleteKey(key) {
	if (!config.redis.enabled) {
		return;
	}

	return delAsync(key);
}

module.exports = {
	initialize: initialize,
	get: getKey,
	set: setKey,
	delete: deleteKey
};
