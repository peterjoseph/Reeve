import validate from "validate.JS";
import async from "async";
import bcrypt from "bcrypt";
import { register } from "~/shared/validation/authentication";
import { t } from "~/shared/translations/i18n";
import { perform } from "../database";
import { generateDate } from "../utilities/date";
import { ROLE_TYPE } from "~/shared/constants";

module.exports = function(router) {
	// Register New Client Account
	router.post("/internal/register", function(req, res, next) {
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
			const errorMsg = { status: 403, message: t("validation.clientInvalidProperties"), reason: valid };
			return next(errorMsg);
		}
		// Generate current date
		const dateTime = generateDate();
		// Perform database connection
		perform().getConnection(function(error, connection) {
			// Return error if database connection error
			if (error) {
				return next(error);
			}
			connection.beginTransaction(function(error) {
				// Return error if begin transaction error
				if (error) {
					connection.release();
					return next(error);
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
								// Return error if query fails
								if (error) {
									chain(error, results);
								} else if (results != null && results.length > 0) {
									// Pass through error object if WorkspaceURL already being used
									const errorMsg = { status: 403, message: t("validation.clientInvalidProperties"), reason: { workspaceURL: [t("validation.validWorkspaceURL")] } };
									chain(errorMsg, null);
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
							const password = bcrypt.hashSync(received.password, 10);
							// Create new user in user table
							const userObject = {
								firstName: received.firstName,
								lastName: received.lastName,
								clientId: clientId,
								emailAddress: received.emailAddress,
								password: password,
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
						if (error) {
							// Rollback transaction if query is unsuccessful
							connection.rollback(function() {
								return next(error);
							});
						} else {
							// Attempt to commit transaction
							connection.commit(function(error) {
								if (error) {
									connection.rollback(function() {
										return next(error);
									});
								} else {
									connection.release();
									res.status(200).send({ status: 200, message: t("label.success") });
								}
							});
						}
					}
				);
			});
		});
	});
};
