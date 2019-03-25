import React, { Component } from "react";
import PropTypes from "prop-types";
import { Route } from "react-router";
import { Redirect } from "react-router-dom";
import { arrayContains, arrayHasAny, variableExists, isObjectEmpty } from "shared/utilities/filters";
import AsyncComponent from "./AsyncComponent";

const DefaultLayout = AsyncComponent(() => import("common/layouts/DefaultLayout"));
const MissingPath = AsyncComponent(() => import("./MissingPath"));

class ProtectedRoute extends Component {
	render() {
		const { path, user, hasAnyRole, hasAllRoles, hasAnyFeature, hasAllFeatures, hasAnySubscription, hasVerifiedEmail, disabled } = this.props;

		// Create a common array of paths we should redirect when found
		const unauthenticatedUserPaths = ["/register", "/forgot", "/signin", "/signin/help", "/reset"];

		// Validate if user is logged in
		const userLoggedIn = variableExists(user) && !isObjectEmpty(user) && variableExists(user.get("userId"));

		// Missing path component for authenticated users
		const mau = (
			<DefaultLayout key={path}>
				<MissingPath />
			</DefaultLayout>
		);

		// Generic render component
		const renderRoute = () => {
			if (!userLoggedIn) {
				return <Redirect to="/signin" />;
			} else {
				return <Route {...this.props} render={() => mau} />;
			}
		};

		/****************************
		NON AUTH REQUIRED USER ROUTES
		****************************/

		// Show verify email page regardless of if user is logged in
		if (["/verify", "/verify/email_change"].includes(path)) {
			return <Route {...this.props} />;
		}

		/****************************
		  NON-LOGGED-IN USER ROUTES
		****************************/

		// Redirect to signin page when on homepage and not logged in
		if (path === "/" && !userLoggedIn) {
			return <Redirect to="/signin" />;
		}

		// If component disabled, render the MissingPath component
		if (disabled && !userLoggedIn) {
			return <Redirect to="/" />;
		}

		// If route cannot be found, display 404 page
		if (path === "*" && !userLoggedIn) {
			return <Redirect to="/" />;
		}

		// If user is not logged in and they access a route designed for un-authenticated users, return the contents
		if (unauthenticatedUserPaths.includes(path) === true && !userLoggedIn) {
			return <Route {...this.props} />;
		}

		// If user is not logged in and they try to access a route designed for authenticated users, redirect to homescreen
		if (unauthenticatedUserPaths.includes(path) === false && !userLoggedIn) {
			return <Redirect to="/" />;
		}

		/****************************
			LOGGED-IN USER ROUTES
		****************************/

		// Redirect to signin page when on homepage and not logged in
		if (path === "/signin" && userLoggedIn) {
			return <Redirect to="/" />;
		}

		// Redirect to billing pages if user is loaded but trial has ended
		if (path !== "/billing" && userLoggedIn && !user.get("subscriptionActive")) {
			return <Redirect to="/billing" />;
		}

		// If user is logged in and they access a disabled route, show missing path
		if (disabled && userLoggedIn) {
			return <Route {...this.props} render={() => mau} />;
		}

		// If route cannot be found, display 404 page
		if (path === "*" && userLoggedIn) {
			return <Route {...this.props} render={() => mau} />;
		}

		// If user is logged in and they access a non-authenticated path, redirect to home
		if (unauthenticatedUserPaths.includes(path) === true && userLoggedIn) {
			return <Route {...this.props} render={() => mau} />;
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
