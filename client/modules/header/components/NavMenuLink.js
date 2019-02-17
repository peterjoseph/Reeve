import React, { Component } from "react";
import { NavLink } from "react-router-dom";
import PropTypes from "prop-types";
import { arrayContains, arrayHasAny } from "shared/utilities/filters";

import User from "common/components/User";

class NavMenuLink extends Component {
	render() {
		const { title, route, isExact, user, feature, role, subscription } = this.props;

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
			<li className="nav-item px-1">
				<NavLink to={route} className={"nav-link"} activeClassName="active" exact={isExact}>
					{title}
				</NavLink>
			</li>
		);
	}
}

NavMenuLink.defaultProps = {
	title: "",
	route: "/",
	isExact: false
};

NavMenuLink.propTypes = {
	title: PropTypes.string,
	route: PropTypes.string,
	user: PropTypes.object,
	isExact: PropTypes.bool,
	feature: PropTypes.oneOfType([PropTypes.array, PropTypes.number]),
	role: PropTypes.oneOfType([PropTypes.array, PropTypes.number]),
	subscription: PropTypes.oneOfType([PropTypes.array, PropTypes.number])
};

export default User(NavMenuLink);
