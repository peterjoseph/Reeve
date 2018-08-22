import React, { Component } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { arrayContains, arrayHasAny } from "shared/utilities/filters";

import User from "common/components/User";

class NavDropdownLink extends Component {
	render() {
		const { title, route, user, feature, role, subscription } = this.props;

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

		return (
			<Link to={route} className="dropdown-item">
				{title}
			</Link>
		);
	}
}

NavDropdownLink.defaultProps = {
	title: "",
	route: "/"
};

NavDropdownLink.propTypes = {
	title: PropTypes.string,
	route: PropTypes.string,
	user: PropTypes.object,
	feature: PropTypes.oneOfType([PropTypes.array, PropTypes.number]),
	role: PropTypes.oneOfType([PropTypes.array, PropTypes.number]),
	subscription: PropTypes.oneOfType([PropTypes.array, PropTypes.number])
};

export default User(NavDropdownLink);
