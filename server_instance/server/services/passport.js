import { database, models } from "services/sequelize";
import moment from "moment";
import { arrayContains } from "shared/utilities/filters";
import { FEATURES } from "shared/constants";

let passport = require("passport");
let JwtStrategy = require("passport-jwt").Strategy;
let ExtractJwt = require("passport-jwt").ExtractJwt;
let config = require("../../config");

function initialize(app) {
	app.use(passport.initialize());
	app.use(passport.session());

	passport.use(
		new JwtStrategy(
			{
				jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme("jwt"),
				secretOrKey: config.authentication.jwtSecret
			},
			function(payload, done) {
				if (payload == null) {
					return done(null, false);
				} else {
					database()
						.query("SELECT * FROM `user` u LEFT JOIN `client` c ON u.`clientId` = c.`id` WHERE u.`id` = ? AND u.`clientId` = ? AND c.`workspaceURL` = ? AND u.`active` = ? LIMIT 1", {
							replacements: [payload.userId, payload.clientId, payload.workspaceURL, true],
							type: database().QueryTypes.SELECT
						})
						.then(result => {
							if (result != null && result.length > 0) {
								// Determine if client subscription is active
								let subscriptionActive = true;
								const endDate = result[0].subscriptionEndDate;
								if (endDate !== null) {
									if (moment(endDate).diff(moment(new Date()), "minutes") <= 0) {
										subscriptionActive = false;
									}
								}
								// Build user object
								const user = { userId: payload.userId, clientId: payload.clientId, workspaceURL: payload.workspaceURL, subscriptionActive: subscriptionActive };
								done(null, user);
							} else {
								done(null, false);
							}
							return null;
						})
						.catch(error => {
							done(null, error);
						});
				}
			}
		)
	);

	passport.serializeUser(function(user, done) {
		done(null, user);
	});

	passport.deserializeUser(function(id, done) {
		models()
			.user.findOne({ where: { id: id, active: true } })
			.then(result => {
				done(null, result);
			})
			.catch(error => {
				done(error, null);
			});
	});
}

function perform() {
	return passport;
}

module.exports = {
	initialize: initialize,
	perform: perform
};
