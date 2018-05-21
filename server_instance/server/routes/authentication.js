import { register } from "~/shared/validation/authentication";
import { t } from "~/shared/translations/i18n";
import { perform } from "../database.js";
import validate from "validate.JS";

// Register New Client Account
module.exports = function(router) {
	// Attempt to create client account
	// Attempt to create new owner level user
	// Pass and throw 'err'
	// Report to Sentry
	// Report to Papertrail
	// Return securityKey
	router.post("/internal/register", function(req, res) {
		// Store received object properties
		const received = {
			workspaceURL: req.body.workspaceURL,
			firstName: req.body.firstName,
			lastName: req.body.lastName,
			emailAddress: req.body.emailAddress,
			password: req.body.password
		};
		// Validate properties in received object
		const valid = validate(received, register);
		if (valid != null) {
			res.status(403).send({ message: t("validation.clientInvalidProperties"), errors: valid });
		}
		// Connect to Database to perform existing Workspace URL Lookup
		perform().getConnection(function(err, connection) {
			if (err) throw err;
			// Check Workspace URL is unique in database
			connection.query("SELECT workspaceURL FROM `client` WHERE `workspaceURL` = ?", [req.body.workspaceURL], function(error, results, fields) {
				if (error) throw error;
				// Send error if workspace url is taken
				if (results != null && results.length > 0) {
					connection.release();
					return res.status(403).send({ message: t("validation.clientInvalidProperties"), errors: valid });
				}
			});
			// Create client row in database
			const clientObject = { name: received.workspaceURL, workspaceURL: received.workspaceURL, createdDate: new Date(), modifiedDate: new Date() };
			connection.query("INSERT INTO client SET ?", clientObject, function(error, results, fields) {
				if (error) throw error;
				// Release connection
				connection.release();
				// Return successful server response
				return res.status(200);
			});
		});
	});
};
