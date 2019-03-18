import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";
import { arrayContains, arrayHasAny } from "shared/utilities/filters";

class HideComponent extends Component {
	render() {
		const { user, children, feature, role, subscription, verifiedEmail } = this.props;

		// Hide if user has incorrect role
		if (role && (!user.get("userRoles") || !arrayHasAny(role, user.get("userRoles").toJS() || []))) {
			return null;
		}

		// Hide if user has incorrect feature
		if (feature && (!user.get("clientFeatures") || !arrayContains(feature, user.get("clientFeatures").toJS() || []))) {
			return null;
		}

		// Hide if user has incorrect subscription
		if (subscription && (!user.get("subscriptionId") || !arrayHasAny(subscription, user.get("subscriptionId") || []))) {
			return null;
		}

		// Error if user does not have a verified email address
		if (verifiedEmail && user.get("emailVerified") !== true) {
			return null;
		}

		return <Fragment>{children}</Fragment>;
	}
}

HideComponent.propTypes = {
	user: PropTypes.object,
	children: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
	feature: PropTypes.oneOfType([PropTypes.array, PropTypes.number]),
	role: PropTypes.oneOfType([PropTypes.array, PropTypes.number]),
	subscription: PropTypes.oneOfType([PropTypes.array, PropTypes.number]),
	verifiedEmail: PropTypes.bool
};

export default HideComponent;
