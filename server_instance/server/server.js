let express = require("express"); // Express Server
let session = require("express-session");
let helmet = require("helmet");
let RedisStore = require("connect-redis")(session);
let path = require("path");
let fs = require("fs");
let https = require("https");
let passport = require("passport"); // Passport authentication management
let JwtStrategy = require("passport-jwt").Strategy;
let ExtractJwt = require("passport-jwt").ExtractJwt;
let cookieParser = require("cookie-parser");
let bodyParser = require("body-parser");
let favicon = require("serve-favicon");
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

// Fetch Favicon
app.use(favicon(path.join(__dirname, "favicon.ico")));

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
		process.stdout.write("Unable to connect to Redis session store\n");
		process.exit(1);
	}
	next();
});

// Initialise user authentication with passport
app.use(passport.initialize());
app.use(passport.session());

passport.use(
	new JwtStrategy(
		{
			jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme("jwt"),
			secretOrKey: config.authentication.jwtSecret
		},
		function(payload, done) {
			database.perform().getConnection(function(error, connection) {
				// Return error if database connection error
				if (error) {
					return done(error);
				}
				connection.query("select * from users where email = '" + payload.email + "'", function(err, rows) {
					if (err) return done(err);
					if (rows) {
						done(null, rows[0]);
					} else {
						done(null, false);
					}
				});
			});
		}
	)
);

passport.serializeUser(function(user, done) {
	done(null, user.id);
});
passport.deserializeUser(function(id, done) {
	database.perform().getConnection(function(error, connection) {
		// Return error if database connection error
		if (error) {
			return done(error);
		}
		connection.query("select * from users where id = " + id, function(err, rows) {
			done(err, rows[0]);
		});
	});
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
app.use(function errorHandler(err, req, res, next) {
	// Report to Sentry
	// Report to Papertrail
	// Report to Kinesis
	const status = err.status != null ? err.status : 500;
	let response = {
		status: status
	};
	if (err.message != null) {
		response.message = err.message;
	}
	if (err.reason != null) {
		response.reason = err.reason;
	}
	res.status(status).send(response);
});

// Set server port
app.set("port", config.build.port || 3000);

// Connect to MySQL database
database.connect(function(err) {
	if (err) {
		process.stdout.write("Unable to connect to MySQL Database\n");
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
					process.stdout.write(`Server listening securely on port: ${server.address().port}\n`);
				});
		} else {
			server = app.listen(app.get("port"), function() {
				process.stdout.write(`Server listening on port: ${server.address().port}\n`);
			});
		}
	}
});

module.exports = app;
