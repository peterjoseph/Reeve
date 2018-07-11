import { models } from "services/sequelize";

let passport = require("passport");
let JwtStrategy = require("passport-jwt").Strategy;
let ExtractJwt = require("passport-jwt").ExtractJwt;
let config = require("../../config");

async function loadUser(payload) {
	try {
		const client = await models().client.findOne({ where: { id: payload.clientId, workspaceURL: payload.workspaceURL, active: true } });
		const user = await models().user.findOne({ where: { id: payload.userId, clientId: payload.clientId, active: true } });

		let userObject = null;

		if (client === null || user === null) {
			return userObject;
		} else {
			return { userId: user.get("id"), clientId: client.get("id"), workspaceURL: client.get("workspaceURL") };
		}
	} catch (err) {
		throw err;
	}
}

function initialize(app, database) {
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
					loadUser(payload)
						.then(result => {
							if (result != null) {
								done(null, result);
							} else {
								done(null, false);
							}
						})
						.catch(error => {
							return done(null, error);
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
