import validate from "validate.JS";
import async from "async";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import passport from "../passport";
import config from "../../config";
import { register, login } from "~/shared/validation/authentication";
import { t } from "~/shared/translations/i18n";
import { perform } from "../database";
import { generateDate } from "~/shared/utilities/date";
import { hasFeature } from "~/shared/utilities/features";
import { SUBSCRIPTION_TYPE, ROLE_TYPE, FEATURES } from "~/shared/constants";

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
				// Create an object to temporarily store data we retrieve from our database
				let dataConstructor = {
					clientId: null,
					userId: null
				};
				// Async update properties in database
				async.series(
					[
						function(chain) {
							// Check if workspaceURL is already in use
							connection.query("SELECT workspaceURL FROM `client` WHERE `workspaceURL` = ? AND `active` = true", [req.body.workspaceURL], function(error, results, fields) {
								// Return error if query fails
								if (error) {
									chain(error, null);
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
							const clientObject = {
								name: received.workspaceURL,
								workspaceURL: received.workspaceURL,
								subscriptionId: SUBSCRIPTION_TYPE.TRIAL,
								createdDate: dateTime,
								modifiedDate: dateTime
							};
							connection.query("INSERT INTO client SET ?", clientObject, function(error, results, fields) {
								if (error) {
									chain(error, null);
								} else {
									// Set our clientId variable when the client has been inserted into table
									dataConstructor.clientId = results.insertId;
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
								clientId: dataConstructor.clientId,
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
									dataConstructor.userId = results.insertId;
									chain(null, results);
								}
							});
						},
						function(chain) {
							// Assign owner role to user
							const roleObject = { userId: dataConstructor.userId, roleId: ROLE_TYPE.OWNER, active: true, createdDate: dateTime, modifiedDate: dateTime };
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

	// Validate Workspace URL
	router.get("/internal/validate_workspace_url/", function(req, res, next) {
		// Get workspaceURL name from header
		const workspaceURL = req.headers["workspaceurl"] ? req.headers["workspaceurl"] : "";
		// Check database for existing WorkspaceURL
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
				// Create an object to temporarily store data we retrieve from our database
				let dataConstructor = {
					clientId: null,
					clientSubscriptionId: null,
					clientFeatures: null,
					clientStyling: false,
					clientStyles: null
				};
				async.series(
					[
						function(chain) {
							// Check if workspaceURL is already in use
							connection.query("SELECT `id`, `subscriptionId` FROM `client` WHERE `workspaceURL` = ? AND `active` = true", [workspaceURL], function(error, results, fields) {
								// Return error if query fails
								if (error) {
									chain(error, null);
								} else if (results != null && results.length > 0) {
									dataConstructor.clientId = results[0].id;
									dataConstructor.clientSubscriptionId = results[0].subscriptionId;
									chain(null, results);
								} else {
									// Pass through error object if WorkspaceURL does not exist
									const errorMsg = { status: 403, message: t("validation.clientInvalidProperties"), reason: { workspaceURL: [t("validation.emptyWorkspaceURL")] } };
									chain(errorMsg, null);
								}
							});
						},
						function(chain) {
							// Fetch list of features for subscription
							connection.query("SELECT `featureId` FROM `subscriptionFeatures` WHERE `subscriptionId` = ?", [dataConstructor.clientSubscriptionId], function(error, results, fields) {
								// Return error if query fails
								if (error) {
									chain(error, null);
								} else {
									// Store client features and whether client styling is enabled
									dataConstructor.clientFeatures = results.map(result => result.featureId);
									dataConstructor.clientStyling = hasFeature(FEATURES.STYLING, dataConstructor.clientFeatures);
									chain(null, results);
								}
							});
						},
						function(chain) {
							// Fetch client styling if properties exist and client has feature
							if (dataConstructor.clientStyling === true) {
								connection.query(
									"SELECT `logoImage`, `backgroundImage`, `backgroundColor`, `primaryColor`, `secondaryColor` FROM `clientStyling` WHERE `clientId` = ?",
									[dataConstructor.clientId],
									function(error, results, fields) {
										// Return error if query fails
										if (error) {
											chain(error, null);
										} else {
											if (results != null && results.length > 0) {
												dataConstructor.clientStyles = {
													logoImage: results[0].logoImage,
													backgroundImage: results[0].backgroundImage,
													backgroundColor: results[0].backgroundColor,
													primaryColor: results[0].primaryColor,
													secondaryColor: results[0].secondaryColor
												};
											}
											chain(null, results);
										}
									}
								);
							} else {
								chain(null, null);
							}
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
									// Build our response object
									const response = { status: 200, message: t("label.success") };
									// If we have client styling, return the data in our object
									if (dataConstructor.clientStyling === true && dataConstructor.clientStyles) {
										response.style = dataConstructor.clientStyles;
									}
									// Return the response object
									res.status(200).send(response);
								}
							});
						}
					}
				);
			});
		});
	});

	// Login to user account
	router.post("/internal/login", function(req, res, next) {
		if (req.body.authToken != null && req.body.authToken === true) {
			authenticateWithToken(req, res, next);
		} else {
			authenticateWithoutToken(req, res, next);
		}
	});

	// Validate authentication if security token is present
	function authenticateWithToken(req, res, next) {
		passport.perform().authenticate("jwt", function(error, user, info) {
			req.logIn(user, function(err) {
				if (error) {
					return next(error);
				}
				// Build our response object
				const response = { status: 200, message: t("label.success") };
				// Return the response object
				return res.status(200).send(response);
			});
		})(req, res, next);
	}

	// Validate authentication if username and password is present
	function authenticateWithoutToken(req, res, next) {
		// Store received object properties
		const received = {
			workspaceURL: req.body.workspaceURL,
			emailAddress: req.body.emailAddress,
			password: req.body.password,
			keepSignedIn: req.body.keepSignedIn
		};
		// Validate properties in received object
		const valid = validate(received, login);
		if (valid != null) {
			const errorMsg = { status: 403, message: t("validation.userInvalidProperties"), reason: valid };
			return next(errorMsg);
		}
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
				// Create an object to temporarily store data we retrieve from our database
				let dataConstructor = {
					clientId: null,
					userId: null,
					password: null,
					token: null
				};
				async.series(
					[
						function(chain) {
							// Check if workspaceURL is already in use
							connection.query("SELECT `id` FROM `client` WHERE `workspaceURL` = ? AND `active` = true", [received.workspaceURL], function(error, results, fields) {
								// Return error if query fails
								if (error) {
									chain(error, null);
								} else if (results != null && results.length > 0) {
									dataConstructor.clientId = results[0].id;
									chain(null, results);
								} else {
									// Pass through error object if WorkspaceURL does not exist
									const errorMsg = { status: 403, message: t("validation.userInvalidProperties"), reason: { workspaceURL: [t("validation.emptyWorkspaceURL")] } };
									chain(errorMsg, null);
								}
							});
						},
						function(chain) {
							// Fetch user based on information provided
							connection.query(
								"SELECT `id`, `password` FROM `user` WHERE `clientId` = ? AND `emailAddress` = ? AND `active` = true",
								[dataConstructor.clientId, received.emailAddress],
								function(error, results, fields) {
									// Return error if query fails
									if (error) {
										chain(error, null);
									} else if (results != null && results.length > 0) {
										dataConstructor.userId = results[0].id;
										dataConstructor.password = results[0].password;
										chain(null, results);
									} else {
										// Pass through error object if WorkspaceURL does not exist
										const errorMsg = { status: 403, message: t("validation.userInvalidProperties"), reason: { emailAddress: [t("validation.userDoesNotExist")] } };
										chain(errorMsg, null);
									}
								}
							);
						},
						function(chain) {
							// Validate the supplied user password
							const valid = bcrypt.compareSync(received.password, dataConstructor.password);
							if (valid === true) {
								dataConstructor.password = null;
								chain(null, valid);
							} else {
								// Pass through error object if password is incorrect
								const errorMsg = { status: 403, message: t("validation.userInvalidProperties"), reason: { password: [t("validation.invalidPasswordSupplied")] } };
								chain(errorMsg, null);
							}
						},
						function(chain) {
							// Create the JSON Web Token for the User
							const token = jwt.sign(
								{ userId: dataConstructor.userId, clientId: dataConstructor.clientId, workspaceURL: received.workspaceURL.trim() },
								config.authentication.jwtSecret,
								{
									expiresIn: config.authentication.expiry
								}
							);
							dataConstructor.token = token;
							chain(null, true);
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
									// Build our response object
									const response = { status: 200, message: t("label.success"), token: dataConstructor.token, keepSignedIn: received.keepSignedIn };
									// Return the response object
									return res.status(200).send(response);
								}
							});
						}
					}
				);
			});
		});
	}
};
