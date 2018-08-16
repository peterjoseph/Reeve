import React, { Component } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";

import User from "common/components/User";

class Header extends Component {
	render() {
		const { user } = this.props;

		// Check if client has uploaded a logo
		const clientLogo = user.get("logoImage") != null && user.get("logoImage") != "";

		return (
			<Link to={"/"} className="navbar-brand pl-2 mr-4" href="#">
				{clientLogo ? <img src={user.get("logoImage")} height="32" /> : <span className="ml-2 text-capitalize">{`${user.get("clientName")}`}</span>}
			</Link>
		);
	}
}

Header.propTypes = {
	user: PropTypes.object
};

export default User(Header);
