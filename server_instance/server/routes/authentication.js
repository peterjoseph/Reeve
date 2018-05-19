import { register } from "~/shared/validation/authentication";

const database = require("../database.js");
const validate = require("validate.js");

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
		// Validate received object
		if (validate(req.body, register)) {
			res.status(403).send({ message: "Client object contains invalid properties" });
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
