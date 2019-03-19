import React, { Component } from "react";
import { NavLink } from "react-router-dom";
import PropTypes from "prop-types";

import User from "common/components/User";
import HideComponent from "common/components/HideComponent";

class NavMenuLink extends Component {
	render() {
		const { title, route, isExact, user, hasAnyRole, hasAllRoles, hasAnyFeature, hasAllFeatures, hasAnySubscription, hasVerifiedEmail } = this.props;

		return (
			<HideComponent
				user={user}
				hasAnyRole={hasAnyRole}
				hasAllRoles={hasAllRoles}
				hasAnyFeature={hasAnyFeature}
				hasAllFeatures={hasAllFeatures}
				hasAnySubscription={hasAnySubscription}
				hasVerifiedEmail={hasVerifiedEmail}
			>
				<li className="nav-item px-1">
					<NavLink to={route} className={"nav-link"} activeClassName="active" exact={isExact}>
						{title}
					</NavLink>
				</li>
			</HideComponent>
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
	hasAnyRole: PropTypes.oneOfType([PropTypes.array, PropTypes.number]),
	hasAllRoles: PropTypes.oneOfType([PropTypes.array, PropTypes.number]),
	hasAnyFeature: PropTypes.oneOfType([PropTypes.array, PropTypes.number]),
	hasAllFeatures: PropTypes.oneOfType([PropTypes.array, PropTypes.number]),
	hasAnySubscription: PropTypes.oneOfType([PropTypes.array, PropTypes.number]),
	hasVerifiedEmail: PropTypes.bool
};

export default User(NavMenuLink);
