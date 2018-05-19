const _ = require("underscore");
const database = require("../database.js");
const restrictedDomains = ["domain", "account", "accounts", "admin", "registration", "signup", "configuration", "web", "mobile", "app", "software", "com", "net", "org"];

// Register New Client Account
module.exports = function(router) {
	// Remove spaces and special characters from workspace url
	// Check Workspace URL is not a critical name
	// Validate workspace url does not exist
	// Validate client object
	// Attempt to create client account
	// Attempt to create new owner level user
	// Report to Sentry
	// Report to Papertrail
	// Return securityKey
	router.post("/internal/register", function(req, res) {
		// Check Workspace URL is not a critical name
		if (_.contains(restrictedDomains, req.body.workspaceURL)) {
			res.status(403).send({ message: "WorkspaceURL is a restricted domain and cannot be used." });
		}
		// Connect to Database to perform existing Workspace URL Lookup
		database.perform().getConnection(function(err, connection) {
			if (err) throw err;
			// Check Workspace URL is unique in database
			connection.query("SELECT WORKSPACE_URL FROM `client` WHERE `WORKSPACE_URL` = ?", ["WORKSPACE_URL"], function(error, results, fields) {
				if (error) throw error;
				// Release connection
				connection.release();
			});
		});
	});
};
