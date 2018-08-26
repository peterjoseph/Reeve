import React, { Component } from "react";
import PropTypes from "prop-types";
import { Route } from "react-router";
import { Redirect } from "react-router-dom";
import moment from "moment";
import { arrayContains, arrayHasAny } from "shared/utilities/filters";
import AsyncComponent from "./AsyncComponent";

const MissingPath = AsyncComponent(() => import("./MissingPath"));

class RedirectComponent extends Component {
	render() {
		const { path, user, role, feature, subscription } = this.props;

		const isNotLoggedIn = !user || user.get("userId") === null;

		// Show certain routes if user is not logged in
		if ((path == "/register" || path == "/forgot" || path == "/signin" || path == "/signin/help" || path == "/reset") && isNotLoggedIn) {
			return <Route {...this.props} />;
		}

		// Show verify email page regardless of if user is logged in
		if (path == "/verify") {
			return <Route {...this.props} />;
		}

		// Redirect if user is not logged in and tries to access restricted page
		if (path !== "/signin" && isNotLoggedIn) {
			return <Redirect to="/signin" />;
		}

		// Redirect if user is loaded
		if ((path === "/signin" || path === "/register" || path === "/forgot" || path === "/reset") && user.get("userId")) {
			return <Redirect to="/" />;
		}

		// Redirect to billing pages if user is loaded but trial has ended
		if (path !== "/billing" && !user.get("subscriptionActive")) {
			return <Redirect to="/billing" />;
		}

		// Show Error 404 if user has incorrect role
		if (role && (!user.get("userRoles") || !arrayHasAny(role, user.get("userRoles").toJS() || []))) {
			return <Route {...this.props} render={() => <MissingPath />} />;
		}

		// Show Error 404 if user has incorrect feature
		if (feature && (!user.get("clientFeatures") || !arrayContains(feature, user.get("clientFeatures").toJS() || []))) {
			return <Route {...this.props} render={() => <MissingPath />} />;
		}

		// Show Error 404 if user has incorrect subscription
		if (subscription && (!user.get("subscriptionId") || !arrayHasAny(subscription, user.get("subscriptionId") || []))) {
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
