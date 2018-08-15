import React, { Component } from "react";
import { NavLink } from "react-router-dom";
import PropTypes from "prop-types";

import User from "common/components/User";

class NavMenuLink extends Component {
	render() {
		const { title, route, isExact } = this.props;

		return (
			<li className="nav-item">
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
	isExact: PropTypes.bool
};

export default User(NavMenuLink);
