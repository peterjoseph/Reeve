import validate from "validate.JS";
import async from "async";
import { register } from "~/shared/validation/authentication";
import { t } from "~/shared/translations/i18n";
import { perform } from "../database";
import { generateDate } from "../utilities/date";
import { ROLE_TYPE } from "~/shared/constants";

module.exports = function(router) {
	// Attempt to create new owner level user
	// Encrypt password
	// Report to Sentry
	// Report to Papertrail
	// Report to Kinesis
	// Return securityKey

	// Register New Client Account
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

		// Generate current date
		const dateTime = generateDate();

		// Perform database connection
		perform().getConnection(function(err, connection) {

			// Return error if database connection error
			if (err) {
				res.status(500);
			}

			// Set clientId to null
			let clientId = null;
			// Set userId to null
			let userId = null;

			// Async update properties in database
			async.series(
				[
					function(chain) {
						// Check if workspaceURL is already in use
						connection.query("SELECT workspaceURL FROM `client` WHERE `workspaceURL` = ?", [req.body.workspaceURL], function(error, results, fields) {
							if ((results != null && results.length > 0) || error) {
								// Pass through error object if failure
								const errorObj = { status: 403, message: t("validation.clientInvalidProperties"), errors: error || valid };
								chain(errorObj, null);
							} else {
								chain(null, results);
							}
						});
					},
					function(chain) {
						// Create clientObject and insert new row in the client table
						const clientObject = { name: received.workspaceURL, workspaceURL: received.workspaceURL, createdDate: dateTime, modifiedDate: dateTime };
						connection.query("INSERT INTO client SET ?", clientObject, function(error, results, fields) {
							if (error) {
								chain(error, null);
							} else {
								// Set our clientId variable when the client has been inserted into table
								clientId = results.insertId;
								chain(null, results);
							}
						});
					},
					function(chain) {
						// Encrypt and salt user password
						// Create new user in user table
						const userObject = {
							firstName: received.firstName,
							lastName: received.lastName,
							clientId: clientId,
							emailAddress: received.emailAddress,
							password: "test",
							createdDate: dateTime,
							modifiedDate: dateTime
						};

						connection.query("INSERT INTO user SET ?", userObject, function(error, results, fields) {
							if (error) {
								chain(error, null);
							} else {
								// Set our userId variable when the user has been inserted into table
								userId = results.insertId;
								chain(null, results);
							}
						});
					},
					function(chain) {
						// Assign owner role to user
						const roleObject = { userId: userId, roleId: ROLE_TYPE.OWNER, active: true, createdDate: dateTime, modifiedDate: dateTime };
						connection.query("INSERT INTO userRoles SET ?", roleObject, function(error, results, fields) {
							if (error) {
								chain(error, null);
							} else {
								chain(null, results);
							}
						});
					}
				],
				function(error, data) {
					// Close our connection regardless of success or failure
					connection.release();
					if (error) {
						res.status(error.status || 503).send({ ...error });
					} else {
						res.status(200).send({ status: 200, message: t("label.success") });
					}
				}
			);
		});
	});
};
