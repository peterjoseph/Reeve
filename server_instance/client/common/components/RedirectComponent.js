import React, { Component } from "react";
import PropTypes from "prop-types";
import { Route } from "react-router";
import { Redirect } from "react-router-dom";
import { arrayContains, arrayHasAny } from "shared/utilities/filters";
import AsyncComponent from "./AsyncComponent";

const MissingPath = AsyncComponent(() => import("./MissingPath"));

class RedirectComponent extends Component {
	render() {
		const { path, user, role, feature, subscription } = this.props;

		const userLoggedIn = user && user.get("userId") !== null;

		// Redirect to signin page when on homepage and not logged in
		if (path === "/" && !userLoggedIn) {
			return <Redirect to="/signin" />;
		}

		// Show verify email page regardless of if user is logged in
		if (path == "/verify") {
			return <Route {...this.props} />;
		}

		// Redirect to billing pages if user is loaded but trial has ended
		if (path !== "/billing" && user && !user.get("subscriptionActive")) {
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
		if (role && ((user && !user.get("userRoles")) || !arrayHasAny(role, (user && user.get("userRoles").toJS()) || []))) {
			return <Route {...this.props} render={() => <MissingPath />} />;
		}

		// Show Error 404 if user has incorrect feature
		if (feature && ((user && !user.get("clientFeatures")) || !arrayContains(feature, (user && user.get("clientFeatures").toJS()) || []))) {
			return <Route {...this.props} render={() => <MissingPath />} />;
		}

		// Show Error 404 if user has incorrect subscription
		if (subscription && ((user && !user.get("subscriptionId")) || !arrayHasAny(subscription, (user && user.get("subscriptionId")) || []))) {
			return <Route {...this.props} render={() => <MissingPath />} />;
		}

		return <Route {...this.props} />;
	}
}

RedirectComponent.propTypes = {
	path: PropTypes.string,
	user: PropTypes.object,
	feature: PropTypes.oneOfType([PropTypes.array, PropTypes.number]),
	role: PropTypes.oneOfType([PropTypes.array, PropTypes.number]),
	subscription: PropTypes.oneOfType([PropTypes.array, PropTypes.number])
};

export default RedirectComponent;
