require("babel-register")({ presets: ["env"] }); // Transpile server code to support ES6

let express = require("express");
let path = require("path");
let fs = require("fs");
let https = require("https");
let helmet = require("helmet");
let uniqid = require("uniqid");
let favicon = require("serve-favicon");
let lusca = require("lusca");
let cors = require("cors");
let compression = require("compression");

let routes = require("./services/router");
let devmiddleware = require("./services/devmiddleware");
let sentry = require("./services/sentry");
let papertrail = require("./services/papertrail");
let passport = require("./services/passport");
let redis = require("./services/redis");
let database = require("./services/sequelize");
let nodemailer = require("./services/nodemailer");
let stripe = require("./services/stripe");
let s3 = require("./services/s3");
let i18n = require("../shared/translations/i18n");
let config = require("../config");

let app = express();

// Load application service dependencies
sentry.initialize(app); // Sentry Error Reporting
papertrail.initialize(app); // Papertrail Logging
redis.initialize(app); // Redis Session Store
devmiddleware.initialize(app); // Webpack Development Middleware
nodemailer.initialize(app); // Nodemailer Email Service
stripe.initialize(app); // Stripe Payment Gateway
passport.initialize(app); // Passport user authentication
s3.initialize(app); // Amazon Web Services S3 Bucket File Uploading

// Set up view engine
app.set("view engine", "html");
app.engine("html", function(path, options, callback) {
	fs.readFile(path, "utf-8", callback);
});

// Enable compression on Routes
app.use(compression());

// Enable Lusca Application Security
app.use(
	lusca({
		//csrf: true
		csp: { policy: [{ "img-src": "'self' http: data:" }, "block-all-mixed-content"] },
		hsts: { maxAge: 31536000, includeSubDomains: true, preload: true },
		xssProtection: true,
		nosniff: true
	})
);

// Enable Helmet for improved endpoint security
app.use(helmet());

// Enable CORS for Routes
app.use(
	cors({
		origin: new RegExp(config.build.domainPath + "$"),
		optionsSuccessStatus: 200,
		methods: "GET,POST,PATCH"
	})
);

// Fetch Favicon
app.use(favicon(path.join(__dirname, "../favicon.ico")));

// Load static files from client directory
app.use(express.static(path.join(__dirname, "../distribution")));

// Force redirect on routes if HTTPS enabled
if (config.build.protocol === "https") {
	app.use(function(req, res, next) {
		if (req.get("X-Forwarded-Proto") !== "https") {
			res.redirect("https://" + req.get("Host") + req.url);
		} else next();
	});
}

// Load the Routes
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
	const status = err.status != null ? err.status : 500;
	let response = {
		status: status,
		message: null,
		reason: null
	};
	if (err.message != null) {
		response.message = err.message;
	}
	if (err.reason != null) {
		response.reason = err.reason;
	}

	if (err.name !== "ServerResponseError") {
		// Generate a unique error code
		const code = uniqid();

		// Append error code to err object
		err.uniqueErrorCode = code;

		// Report full trace to Papertrail
		papertrail.logging() && papertrail.logging().error(err);

		res.status(500).send({ status: 500, message: i18n.t("error.internalServerError", { code: code }) });
	} else {
		// Report basic error to Papertrail
		papertrail.logging() && papertrail.logging().error(response);

		// Send response to client
		res.status(status).send(response);
	}
});

// Set server port
app.set("port", config.build.port || 3000);

// Connect to MySQL database
database.connect(() => {
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
});

module.exports = app;
