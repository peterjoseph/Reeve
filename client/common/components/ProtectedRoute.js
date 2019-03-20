import React, { Component } from "react";
import PropTypes from "prop-types";
import { Route } from "react-router";
import { Redirect } from "react-router-dom";
import { arrayContains, arrayHasAny, variableExists } from "shared/utilities/filters";
import AsyncComponent from "./AsyncComponent";

const MissingPath = AsyncComponent(() => import("./MissingPath"));

class ProtectedRoute extends Component {
	render() {
		const { path, user, hasAnyRole, hasAllRoles, hasAnyFeature, hasAllFeatures, hasAnySubscription, hasVerifiedEmail, disabled } = this.props;

		// Validate if user is logged in
		const userLoggedIn = variableExists(user) && user.get("userId") !== null;

		// Generic render component
		const renderRoute = () => {
			if (!userLoggedIn) {
				return <Redirect to="/signin" />;
			} else {
				return <Route {...this.props} render={() => <MissingPath />} />;
			}
		};

		// If component disabled, render the MissingPath component
		if (disabled) {
			return <Route {...this.props} render={() => <MissingPath />} />;
		}

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

		// Create a common array of paths we should redirect when found
		const sharedPaths = ["/register", "/forgot", "/signin", "/signin/help", "/reset"];

		// If user is not logged in and they access a non-authenticated path, return the contents
		if (sharedPaths.includes(path) === true && !userLoggedIn) {
			return <Route {...this.props} />;
		}

		// If user is not logged in and they try to access one of the authenticated path, redirect to homescreen
		if (sharedPaths.includes(path) === false && !userLoggedIn) {
			return <Redirect to="/" />;
		}

		// If user is logged in and they access a non-authenticated path, redirect to home
		if (sharedPaths.includes(path) === true && userLoggedIn) {
			return <Redirect to="/" />;
		}

		// Show Error 404 if user does not have any of the following roles
		if (hasAnyRole && ((userLoggedIn && !user.get("userRoles")) || !arrayHasAny(hasAnyRole, (userLoggedIn && user.get("userRoles").toJS()) || []))) {
			renderRoute();
		}

		// Show Error 404 if user does not have all of the following roles
		if (hasAllRoles && ((userLoggedIn && !user.get("userRoles")) || !arrayHasAny(hasAllRoles, (userLoggedIn && user.get("userRoles").toJS()) || []))) {
			renderRoute();
		}

		// Show Error 404 if user does not have any of the following features
		if (hasAnyFeature && ((userLoggedIn && !user.get("clientFeatures")) || !arrayHasAny(hasAnyFeature, (userLoggedIn && user.get("clientFeatures").toJS()) || []))) {
			renderRoute();
		}

		// Show Error 404 if user does not have all of the following features
		if (hasAllFeatures && ((userLoggedIn && !user.get("clientFeatures")) || !arrayContains(hasAllFeatures, (userLoggedIn && user.get("clientFeatures").toJS()) || []))) {
			renderRoute();
		}

		// Show Error 404 if user does not have any of the following subscriptions
		if (hasAnySubscription && ((userLoggedIn && !user.get("subscriptionId")) || !arrayHasAny(hasAnySubscription, (userLoggedIn && user.get("subscriptionId")) || []))) {
			renderRoute();
		}

		// Show Error 404 if user does not have a verified email
		if (hasVerifiedEmail && ((userLoggedIn && !user.get("emailVerified")) || (userLoggedIn && user.get("emailVerified")) !== true)) {
			renderRoute();
		}

		return <Route {...this.props} />;
	}
}

ProtectedRoute.propTypes = {
	path: PropTypes.oneOfType([PropTypes.array, PropTypes.string]),
	user: PropTypes.object,
	hasAnyRole: PropTypes.oneOfType([PropTypes.array, PropTypes.number]),
	hasAllRoles: PropTypes.oneOfType([PropTypes.array, PropTypes.number]),
	hasAnyFeature: PropTypes.oneOfType([PropTypes.array, PropTypes.number]),
	hasAllFeatures: PropTypes.oneOfType([PropTypes.array, PropTypes.number]),
	hasAnySubscription: PropTypes.oneOfType([PropTypes.array, PropTypes.number]),
	hasVerifiedEmail: PropTypes.bool,
	disabled: PropTypes.bool
};

export default ProtectedRoute;
