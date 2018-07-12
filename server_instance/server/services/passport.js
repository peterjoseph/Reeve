import { database, models } from "services/sequelize";

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
						.query("SELECT * FROM `user` u LEFT JOIN `client` c ON u.`clientId` = c.`id` WHERE u.`id` = ? AND u.`clientId` = ? AND c.`workspaceURL` = ? AND u.`active` = ?", {
							replacements: [payload.userId, payload.clientId, payload.workspaceURL, true],
							type: database().QueryTypes.SELECT
						})
						.then(result => {
							if (result != null) {
								const user = { userId: payload.userId, clientId: payload.clientId, workspaceURL: payload.workspaceURL };
								done(null, user);
							} else {
								done(null, false);
							}
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
