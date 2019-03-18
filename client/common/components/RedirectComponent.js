import React, { Component } from "react";
import PropTypes from "prop-types";
import { Route } from "react-router";
import { Redirect } from "react-router-dom";
import { arrayContains, arrayHasAny, variableExists } from "shared/utilities/filters";
import AsyncComponent from "./AsyncComponent";

const MissingPath = AsyncComponent(() => import("./MissingPath"));

class RedirectComponent extends Component {
	render() {
		const { path, user, role, feature, subscription, verifiedEmail } = this.props;

		const userLoggedIn = variableExists(user) && user.get("userId") !== null;

		// Redirect to signin page when on homepage and not logged in
		if (path === "/" && !userLoggedIn) {
			return <Redirect to="/signin" />;
		}

		// Show verify email page regardless of if user is logged in
		if (path == "/verify") {
			return <Route {...this.props} />;
		}

		// Redirect to billing pages if user is loaded but trial has ended
		if (path !== "/billing" && userLoggedIn && !user.get("subscriptionActive")) {
			return <Redirect to="/billing" />;
		}

		// Show certain routes if user is not logged in
		if ((path == "/register" || path == "/forgot" || path == "/signin" || path == "/signin/help" || path == "/reset") && !userLoggedIn) {
			return <Route {...this.props} />;
		}

		// Redirect if user is loaded
		if ((path == "/register" || path == "/forgot" || path == "/signin" || path == "/signin/help" || path == "/reset") && userLoggedIn) {
			return <Redirect to="/" />;
		}

		// Show Error 404 if user has incorrect role
		if (role && ((userLoggedIn && !user.get("userRoles")) || !arrayHasAny(role, (userLoggedIn && user.get("userRoles").toJS()) || []))) {
			if (!userLoggedIn) {
				return <Redirect to="/signin" />;
			} else {
				return <Route {...this.props} render={() => <MissingPath />} />;
			}
		}

		// Show Error 404 if user has incorrect feature
		if (feature && ((userLoggedIn && !user.get("clientFeatures")) || !arrayContains(feature, (userLoggedIn && user.get("clientFeatures").toJS()) || []))) {
			if (!userLoggedIn) {
				return <Redirect to="/signin" />;
			} else {
				return <Route {...this.props} render={() => <MissingPath />} />;
			}
		}

		// Show Error 404 if user has incorrect subscription
		if (subscription && ((userLoggedIn && !user.get("subscriptionId")) || !arrayHasAny(subscription, (userLoggedIn && user.get("subscriptionId")) || []))) {
			if (!userLoggedIn) {
				return <Redirect to="/signin" />;
			} else {
				return <Route {...this.props} render={() => <MissingPath />} />;
			}
		}

		// Show Error 404 if user does not have a verified email
		if (verifiedEmail && ((userLoggedIn && !user.get("emailVerified")) || (userLoggedIn && user.get("emailVerified")) !== true)) {
			if (!userLoggedIn) {
				return <Redirect to="/signin" />;
			} else {
				return <Route {...this.props} render={() => <MissingPath />} />;
			}
		}

		return <Route {...this.props} />;
	}
}

RedirectComponent.propTypes = {
	path: PropTypes.string,
	user: PropTypes.object,
	feature: PropTypes.oneOfType([PropTypes.array, PropTypes.number]),
	role: PropTypes.oneOfType([PropTypes.array, PropTypes.number]),
	subscription: PropTypes.oneOfType([PropTypes.array, PropTypes.number]),
	verifiedEmail: PropTypes.bool
};

export default RedirectComponent;
