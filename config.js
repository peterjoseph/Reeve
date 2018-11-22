if (process.env.NODE_ENV !== "production") {
	require("dotenv").config({ path: "config.env" });
}

let config = {
	build: {
		release: process.env.RELEASE,
		environment: process.env.NODE_ENV,
		protocol: process.env.PROTOCOL,
		key: process.env.KEY,
		certificate: process.env.CERTIFICATE,
		server: process.env.SERVER,
		port: process.env.PORT,
		publicPath: process.env.PUBLICPATH,
		domainPath: process.env.DOMAINPATH
	},
	authentication: {
		jwtSecret: process.env.JWT_SECRET,
		expiry: process.env.JWT_EXPIRY
	},
	development: {
		analyzeBundle: String(process.env.ANALYZE_BUNDLE) === "true"
	},
	environment: process.env.ENVIRONMENT,
	database: {
		host: process.env.DB_HOST,
		username: process.env.DB_USER,
		password: process.env.DB_PASS,
		schema: process.env.DB_SCHEMA,
		max: parseInt(process.env.DB_POOL_MAX),
		min: parseInt(process.env.DB_POOL_MIN),
		acquire: parseInt(process.env.DB_POOL_ACQUIRE),
		idle: parseInt(process.env.DB_POOL_IDLE)
	},
	email: {
		senderAddress: process.env.EMAIL_SENDER_ADDRESS,
		host: process.env.EMAIL_HOST,
		port: process.env.EMAIL_PORT,
		secure: String(process.env.EMAIL_SECURE) === "true",
		auth: {
			username: process.env.EMAIL_AUTH_USERNAME,
			password: process.env.EMAIL_AUTH_PASSWORD
		}
	},
	stripe: {
		enabled: process.env.STRIPE_ENABLED,
		secretKey: process.env.STRIPE_SECRET_KEY
	},
	redis: {
		host: process.env.R_HOST,
		port: process.env.R_PORT,
		pass: process.env.R_PASS,
		proxy: String(process.env.R_PROXY) === "true",
		secret: process.env.R_SECRET,
		resave: String(process.env.R_RESAVE) === "true",
		saveUninitialized: String(process.env.R_SAVE_UNINITIALIZED) === "true"
	},
	sentry: {
		enabled: String(process.env.SENTRY_ENABLED) === "true",
		dns: process.env.SENTRY_DSN
	},
	papertrail: {
		enabled: String(process.env.PAPERTRAIL_ENABLED) === "true",
		host: process.env.PAPERTRAIL_HOST,
		port: process.env.PAPERTRAIL_PORT,
		hostname: process.env.PAPERTRAIL_HOSTNAME,
		level: process.env.PAPERTRAIL_LEVEL
	}
};

module.exports = config;
