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

		// Show register page if user is not logged in
		if (path == "/register" && (!user || user.get("userId") === null)) {
			return <Route {...this.props} />;
		}

		// Show forgot password if user is not logged in
		if (path == "/forgot" && (!user || user.get("userId") === null)) {
			return <Route {...this.props} />;
		}

		// Show login page if user is not logged in
		if (path == "/signin" && (!user || user.get("userId") === null)) {
			return <Route {...this.props} />;
		}

		// Redirect if user is not logged in and tries to access restricted page
		if (path !== "/signin" && (!user || user.get("userId") === null)) {
			return <Redirect to="/signin" />;
		}

		// Redirect if user is loaded
		if ((path === "/signin" || path === "/register" || path === "/forgot") && user.get("userId")) {
			return <Redirect to="/" />;
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
		if (subscription && (!user.get("clientFeatures") || !arrayContains(subscription, user.get("subscriptionId").toJS() || []))) {
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
