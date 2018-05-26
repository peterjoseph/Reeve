let express = require("express"); // Express Server
let session = require("express-session");
let helmet = require("helmet");
let RedisStore = require("connect-redis")(session);
let path = require("path");
let async = require("async");
let fs = require("fs");
let https = require("https");
let passport = require("passport"); // Passport authentication management
let LocalStrategy = require("passport-local").Strategy;
let JwtStrategy = require("passport-jwt").Strategy;
let ExtractJwt = require("passport-jwt").ExtractJwt;
let cookieParser = require("cookie-parser");
let bodyParser = require("body-parser");
let loadWebpack = require("./server.dev.js");
let routes = require("./router"); // Server Routes
let app = express();

let database = require("./database");
let config = require("../config");

// Set up Sentry Error Reporting
if (config.sentry.enabled && config.build.environment === "production") {
	let raven = require("raven");
	raven.config(config.sentry.dns).install();
	app.use(raven.requestHandler());
	app.use(raven.errorHandler());
}

// Set up Papertrail Logging
if (config.papertrail.enabled && config.build.environment === "production") {
	let winston = require("winston");
	let WinstonPapertrail = require("winston-papertrail").Papertrail;
	const transport = new WinstonPapertrail({
		host: config.papertrail.host,
		port: config.papertrail.port,
		hostname: config.papertrail.hostname,
		level: config.papertrail.level,
		logFormat: function(level, message) {
			return "[" + level + "] " + message;
		}
	});

	let logger = new winston.Logger({
		transports: [transport]
	});
}

// Set up view engine
app.set("view engine", "html");
app.engine("html", function(path, options, callbacks) {
	fs.readFile(path, "utf-8", callback);
});

// Enable Helmet for improved endpoint security
app.use(helmet());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// Set up password authentication middleware
app.use(passport.initialize());
app.use(passport.session());

// Handle reloading server in development mode
if (config.build.environment === "development") {
	loadWebpack(app);
} else {
	// Load packaged files in production
	app.use(express.static(path.join(__dirname, "../client")));
}

// Connection to Redis user session store
app.use(
	session({
		store: new RedisStore({
			host: config.redis.host,
			port: config.redis.port
		}),
		secret: config.redis.secret,
		proxy: false,
		resave: config.redis.resave,
		saveUninitialized: false
	})
);

// Handle Redis connection failure
app.use(function(req, res, next) {
	if (!req.session) {
		console.log("Unable to connect to Redis session store");
		process.exit(1);
	}
	next();
});

// Set Routes
app.use(function(err, req, res, next) {
	res.status(err.status || 500);
});
app.use("/", routes);

// Set Message Headers
app.use(function noCache(req, res, next) {
	res.header("Cache-Control", "no-cache, no-store, must-revalidate");
	res.header("Pragma", "no-cache");
	res.header("Expires", 0);
	next();
});

// Handle server errors

// Report to Sentry
// Report to Papertrail
// Report to Kinesis
app.use(function errorHandler(err, req, res, next) {
	res.status(500).send({ status: 500, error: err });
});

// Set server port
app.set("port", config.build.port || 3000);

// Connect to MySQL database
database.connect(function(err) {
	if (err) {
		console.log("Unable to connect to MySQL Database");
		process.exit(1);
	} else {
		// Load server if database connection successful
		let server = null;
		if (config.build.protocol === "https") {
			// Create https server if specified
			server = https
				.createServer(
					{
						key: fs.readFileSync(config.build.key),
						cert: fs.readFileSync(config.build.certificate)
					},
					app
				)
				.listen(app.get("port"), function() {
					console.log(`Server listening securely on port: ${server.address().port}`);
				});
		} else {
			server = app.listen(app.get("port"), function() {
				console.log(`Server listening on port: ${server.address().port}`);
			});
		}
	}
});

module.exports = app;
