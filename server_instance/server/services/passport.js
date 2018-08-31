import { models } from "services/sequelize";
import moment from "moment";

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
					loadUser(payload.workspaceURL, payload.clientId, payload.userId)
						.then(result => {
							return done(null, result);
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

async function loadUser(workspaceURL, clientId, userId) {
	// Load a client using a workspaceURL
	const client = await models().client.findOne({ where: { id: clientId, workspaceURL: workspaceURL, active: true } });

	// Load user for the session
	const user = await models().user.findOne({ where: { id: userId, clientId: client.get("id"), active: true } });

	// Return false if client or user could not be loaded
	if (client === null || user === null) {
		return false;
	}

	// Determine if client subscription is active
	let subscriptionActive = true;
	const endDate = client.get("subscriptionEndDate");
	if (endDate !== null) {
		if (moment(endDate).diff(moment(new Date()), "minutes") <= 0) {
			subscriptionActive = false;
		}
	}

	// Load client features
	let features = await models().subscriptionFeatures.findAll({ where: { subscriptionId: client.get("subscriptionId") } });
	features = features && features.length > 0 && features.map(result => result.get("featureId"));

	// Load user roles
	let roles = await models().userRoles.findAll({ where: { userId: user.get("id") } });
	roles = roles && roles.length > 0 && roles.map(result => result.get("roleId"));

	return {
		userId: user.get("id"),
		clientId: client.get("id"),
		workspaceURL: client.get("workspaceURL"),
		subscriptionActive: subscriptionActive,
		features: features,
		roles: roles
	};
}

function perform() {
	return passport;
}

module.exports = {
	initialize: initialize,
	perform: perform
};
