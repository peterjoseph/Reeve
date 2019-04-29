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
	redis: {
		enabled: String(process.env.R_ENABLED) === "true",
		host: process.env.R_HOST,
		port: process.env.R_PORT,
		pass: process.env.R_PASS,
		keyExpiry: process.env.R_KEY_EXPIRY
	},
	email: {
		enabled: String(process.env.EMAIL_ENABLED) === "true",
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
		enabled: String(process.env.STRIPE_ENABLED) === "true",
		apiKey: process.env.STRIPE_API_KEY
	},
	s3: {
		enabled: String(process.env.S3_ENABLED) === "true",
		accessKeyId: process.env.S3_ACCESS_KEY_ID,
		secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
		region: process.env.S3_REGION,
		endpoint: process.env.S3_ENDPOINT_URL,
		useAccelerateEndpoint: String(process.env.S3_ACCELERATE_ENDPOINT) === "true",
		forcePathStyle: String(process.env.S3_FORCE_PATH_STYLE) === "true",
		bucketEndpoint: String(process.env.S3_BUCKET_ENDPOINT) === "true",
		signatureVersion: process.env.S3_SIGNATURE_VERSION,
		bucket: process.env.S3_BUCKET,
		fileDestination: process.env.S3_FILE_DEST
	},
	cloudfront: {
		enabled: String(process.env.CF_ENABLED) === "true",
		accessKeyId: process.env.CF_ACCESS_KEY_ID,
		privateAccessKey: process.env.CF_PRIVATE_ACCESS_KEY,
		endpoint: process.env.CF_ENDPOINT_URL
	},
	googleAnalytics: {
		enabled: String(process.env.GOOGLE_ANALYTICS_ENABLED) === "true",
		tracking: process.env.GOOGLE_ANALYTICS_TRACKING
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
	},
	deleteWorkspace: {
		GDPRDelete: String(process.env.GDPR_HARD_DELETE) === "true"
	}
};

module.exports = config;
