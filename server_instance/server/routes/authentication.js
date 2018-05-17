const database = require("../database.js");

// Register New Client Account
module.exports = function(router) {
	// Validate client object
	// Attempt to create client account
	// Attempt to create new owner level user
	// Report to Sentry
	// Report to Papertrail
	// Return securityKey
	router.post("/internal/register", function(req, res) {
		database.perform().getConnection(function(err, connection) {
			if (err) throw err;
			connection.query("", function(error, results, fields) {
				if (error) throw error;
				// Release connection
				connection.release();
			});
		});
	});
};
