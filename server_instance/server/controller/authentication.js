import validate from "validate.JS";
import async from "async";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import passport from "../services/passport";
import config from "../../config";
import { register, login } from "shared/validation/authentication";
import { t } from "shared/translations/i18n";
import { perform } from "../services/sequelize";
import { ServerResponseError } from "utilities/errors/serverResponseError";
import { validateWorkspaceURL, registerNewClient, authenticateWithToken, authenticateWithoutToken } from "../orchestrator/authentication";

module.exports = function(router) {
	// Validate Workspace URL
	router.get("/internal/validate_workspace_url/", function(req, res, next) {
		// Get workspaceURL name from header
		const workspaceURL = req.headers["workspaceurl"] ? req.headers["workspaceurl"] : "";

		// Validate header item exists
		if (workspaceURL === null || workspaceURL === "") {
			const error = new ServerResponseError(403, t("validation.clientInvalidProperties"), { workspaceURL: [t("validation.emptyWorkspaceURL")] });
			return next(error);
		}

		// Validate workspaceURL and return response
		validateWorkspaceURL(workspaceURL).then(
			result => {
				return res.status(200).send(result);
			},
			error => {
				return next(error);
			}
		);
	});

	// Register New Client Account
	router.post("/internal/register", function(req, res, next) {
		// Store received object properties
		const body = {
			workspaceURL: req.body.workspaceURL,
			firstName: req.body.firstName,
			lastName: req.body.lastName,
			emailAddress: req.body.emailAddress,
			password: req.body.password,
			privacyConsent: req.body.privacyConsent
		};
		// Validate properties in received object
		const valid = validate(body, register);
		if (valid != null) {
			const errorMsg = new ServerResponseError(403, t("validation.clientInvalidProperties"), valid);
			return next(errorMsg);
		}

		// Register new client and return response
		registerNewClient(body).then(
			result => {
				return res.status(200).send(result);
			},
			error => {
				return next(error);
			}
		);
	});

	// Login to user account
	router.post("/internal/login", function(req, res, next) {
		// Authenticate with token if authToken exists
		if (req.body.authToken != null && req.body.authToken === true) {
			authenticateWithToken(req).then(
				result => {
					return res.status(200).send(result);
				},
				error => {
					return next(error);
				}
			);
		}

		// Authenticate with user properties sent in body
		const received = {
			workspaceURL: req.body.workspaceURL,
			emailAddress: req.body.emailAddress,
			password: req.body.password,
			keepSignedIn: req.body.keepSignedIn
		};
		// Validate properties in received object
		const valid = validate(received, login);
		if (valid != null) {
			const errorMsg = new ServerResponseError(403, t("validation.userInvalidProperties"), valid);
			return next(errorMsg);
		}
		authenticateWithoutToken(received).then(
			result => {
				return res.status(200).send(result);
			},
			error => {
				return next(error);
			}
		);
	});

	/* 
	// Validate authentication if security token is present
	function authenticateWithToken(req, res, next) {
		passport.perform().authenticate("jwt", function(error, user, info) {
			if (error) {
				return next(error);
			}
			req.logIn(user, function(error) {
				if (error) {
					return next(error);
				}
				if (user) {
					// Build our response object
					const response = { status: 200, message: t("label.success") };
					// Return the response object
					return res.status(200).send(response);
				} else {
					const errorMsg = { status: 403, message: t("validation.tokenInvalidOrExpired"), reason: { token: [t("validation.tokenInvalidOrExpired")] } };
					return next(errorMsg);
				}
			});
		})(req, res, next);
	}
	
	*/

	// Load user properties
	router.get("/internal/load_user/", passport.perform().authenticate("jwt"), function(req, res, next) {
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
				// Create an empty user object
				let dataConstructor = {};
				async.series(
					[
						function(chain) {
							// Fetch user
							connection.query(
								"SELECT u.`id`, u.`firstName`, u.`lastName`, u.`emailAddress`, c.`name`, c.`workspaceURL`, c.`subscriptionId`, c.`subscriptionStartDate`, c.`subscriptionEndDate`, c.`billingCycle` FROM `user` u LEFT JOIN `client` c ON u.`clientId` = c.`id` WHERE u.`id` = ? AND u.`clientId` = ? AND c.`workspaceURL` = ? AND u.`active` = ?",
								[req.user.userId, req.user.clientId, req.user.workspaceURL, true],
								function(error, results, fields) {
									// Return error if query fails
									if (error) {
										chain(error, null);
									} else {
										if (results != null && results.length > 0) {
											dataConstructor = {
												userId: results[0].id,
												firstName: results[0].firstName,
												lastName: results[0].lastName,
												emailAddress: results[0].emailAddress,
												clientName: results[0].name,
												workspaceURL: results[0].workspaceURL,
												subscriptionId: results[0].subscriptionId,
												subscriptionStartDate: results[0].subscriptionStartDate,
												subscriptionEndDate: results[0].subscriptionEndDate,
												billingCycle: results[0].billingCycle
											};
										}
										chain(null, results);
									}
								}
							);
						},
						function(chain) {
							// Fetch list of features for subscription
							connection.query("SELECT `featureId` FROM `subscriptionFeatures` WHERE `subscriptionId` = ?", [dataConstructor.subscriptionId], function(error, results, fields) {
								// Return error if query fails
								if (error) {
									chain(error, null);
								} else {
									// Store client features
									dataConstructor.clientFeatures = results.map(result => result.featureId);
									chain(null, results);
								}
							});
						},
						function(chain) {
							// Fetch list of roles for the loaded user
							connection.query("SELECT `roleId` FROM `userRoles` WHERE `userId` = ? AND `active` = ?", [dataConstructor.userId, true], function(error, results, fields) {
								// Return error if query fails
								if (error) {
									chain(error, null);
								} else {
									// Store client features
									dataConstructor.userRoles = results.map(result => result.roleId);
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
									// Build our response object
									const response = { status: 200, message: t("label.success"), user: dataConstructor };
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
};
