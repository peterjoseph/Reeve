import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";
import { arrayContains, arrayHasAny, variableExists } from "shared/utilities/filters";

class HideComponent extends Component {
	render() {
		const { user, children, hasAnyRole, hasAllRoles, hasAnyFeature, hasAllFeatures, hasAnySubscription, hasVerifiedEmail, disabled } = this.props;

		// Hide component if disabled prop set to true
		if (disabled) {
			return null;
		}

		// Validate if user is logged in
		const userLoggedIn = variableExists(user) && user.get("userId") !== null;

		// Hide if user does not have any of the following roles
		if (hasAnyRole && ((userLoggedIn && !user.get("userRoles")) || !arrayHasAny(hasAnyRole, (userLoggedIn && user.get("userRoles").toJS()) || []))) {
			return null;
		}

		// Hide if user does not have all of the following roles
		if (hasAllRoles && ((userLoggedIn && !user.get("userRoles")) || !arrayHasAny(hasAllRoles, (userLoggedIn && user.get("userRoles").toJS()) || []))) {
			return null;
		}

		// Hide if user does not have any of the following features
		if (hasAnyFeature && ((userLoggedIn && !user.get("clientFeatures")) || !arrayHasAny(hasAnyFeature, (userLoggedIn && user.get("clientFeatures").toJS()) || []))) {
			return null;
		}

		// Hide if user does not have all of the following features
		if (hasAllFeatures && ((userLoggedIn && !user.get("clientFeatures")) || !arrayContains(hasAllFeatures, (userLoggedIn && user.get("clientFeatures").toJS()) || []))) {
			return null;
		}

		// Hide if user does not have any of the following subscriptions
		if (hasAnySubscription && ((userLoggedIn && !user.get("subscriptionId")) || !arrayHasAny(hasAnySubscription, (userLoggedIn && user.get("subscriptionId")) || []))) {
			return null;
		}

		// Hide if user does not have a verified email
		if (hasVerifiedEmail && ((userLoggedIn && !user.get("emailVerified")) || (userLoggedIn && user.get("emailVerified")) !== true)) {
			return null;
		}

		return <Fragment>{children}</Fragment>;
	}
}

HideComponent.propTypes = {
	disabled: PropTypes.bool,
	user: PropTypes.object,
	hasAnyRole: PropTypes.oneOfType([PropTypes.array, PropTypes.number]),
	hasAllRoles: PropTypes.oneOfType([PropTypes.array, PropTypes.number]),
	hasAnyFeature: PropTypes.oneOfType([PropTypes.array, PropTypes.number]),
	hasAllFeatures: PropTypes.oneOfType([PropTypes.array, PropTypes.number]),
	hasAnySubscription: PropTypes.oneOfType([PropTypes.array, PropTypes.number]),
	hasVerifiedEmail: PropTypes.bool,
	children: PropTypes.oneOfType([PropTypes.string, PropTypes.object])
};

export default HideComponent;
