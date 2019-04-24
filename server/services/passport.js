import { models } from "services/sequelize";
import redis from "services/redis";
import jwt from "jsonwebtoken";
import moment from "moment";
import bcrypt from "bcrypt";
import { variableExists } from "shared/utilities/filters";

let uuidv1 = require("uuid/v1");
let passport = require("passport");
let LocalStrategy = require("passport-local").Strategy;
let JwtStrategy = require("passport-jwt").Strategy;
let ExtractJwt = require("passport-jwt").ExtractJwt;
let config = require("../../config");

function initialize(app) {
	app.use(passport.initialize());

	// Local Authentication Strategy (Workspace Name, Username & Password)
	passport.use(
		new LocalStrategy(
			{
				usernameField: "emailAddress",
				passwordField: "password",
				passReqToCallback: true
			},
			function(req, u, p, done) {
				if (req.body == null) {
					return done(null, false);
				} else {
					LocalStrategyLoadUser(req.body.workspaceURL, req.body.emailAddress, req.body.password)
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

	// JSON Web Token Authentication Strategy
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
					JWTStrategyLoadUser(payload.sessionId, payload.workspaceURL, payload.clientId, payload.userId)
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
		done(null, user.userId);
	});
}

async function LocalStrategyLoadUser(workspaceURL, emailAddress, password) {
	// Load a client using a workspaceURL
	const client = await models().client.findOne({ where: { workspaceURL: workspaceURL, active: true } });

	// Load user based on provided values
	const user = await models().user.findOne({ where: { clientId: client.get("id"), emailAddress: emailAddress, active: true } });

	// Return false if client or user could not be loaded
	if (client === null || user === null) {
		return false;
	}

	// Validate the supplied user password
	const valid = await bcrypt.compare(password, user.get("password"));
	if (valid === false) {
		return false;
	}

	// Generate a unique session id to store in the redis db and compare with the active token
	const sessionId = await uuidv1();

	// Create the JSON Web Token for the User
	const token = await jwt.sign(
		{
			sessionId: sessionId,
			userId: user.get("id"),
			clientId: client.get("id"),
			workspaceURL: client.get("workspaceURL")
		},
		config.authentication.jwtSecret,
		{
			expiresIn: config.authentication.expiry
		}
	);

	// Send new token to redis store
	if (config.redis.enabled) {
		await redis.set(sessionId, new Date().getTime().toString(), config.redis.keyExpiry);
	}

	return {
		userId: user.get("id"),
		clientId: client.get("id"),
		workspaceURL: client.get("workspaceURL"),
		token: token
	};
}

async function JWTStrategyLoadUser(sessionId, workspaceURL, clientId, userId) {
	// Connect to redis and check if there is an active session for the provided key
	if (config.redis.enabled) {
		const activeSession = await redis.get(sessionId);
		if (!variableExists(activeSession)) {
			return false;
		}
	}

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
		sessionId: sessionId,
		userId: user.get("id"),
		clientId: client.get("id"),
		workspaceURL: client.get("workspaceURL"),
		subscriptionActive: subscriptionActive,
		features: features,
		roles: roles,
		emailVerified: String(user.get("emailVerified")) === "true"
	};
}

function perform() {
	return passport;
}

module.exports = {
	initialize: initialize,
	perform: perform
};
