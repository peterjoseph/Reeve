import React, { Component } from "react";
import { NavLink } from "react-router-dom";
import PropTypes from "prop-types";
import HideComponent from "common/components/HideComponent";

import User from "common/components/User";

class MenuLink extends Component {
	render() {
		const { title, route, isExact, user, feature, role, subscription, hasVerifiedEmail } = this.props;

		return (
			<HideComponent user={user} feature={feature} role={role} subscription={subscription} hasVerifiedEmail={hasVerifiedEmail}>
				<li className="nav-item my-1">
					<NavLink to={route} className={"nav-link py-2"} activeClassName="active" exact={isExact}>
						{title}
					</NavLink>
				</li>
			</HideComponent>
		);
	}
}

MenuLink.defaultProps = {
	title: "",
	route: "/",
	isExact: false
};

MenuLink.propTypes = {
	title: PropTypes.string,
	route: PropTypes.string,
	user: PropTypes.object,
	isExact: PropTypes.bool,
	feature: PropTypes.oneOfType([PropTypes.array, PropTypes.number]),
	role: PropTypes.oneOfType([PropTypes.array, PropTypes.number]),
	subscription: PropTypes.oneOfType([PropTypes.array, PropTypes.number]),
	hasVerifiedEmail: PropTypes.bool
};

export default User(MenuLink);
