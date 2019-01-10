import React, { Component, Fragment } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";

import User from "common/components/User";

class NavProfileMenuLogo extends Component {
	render() {
		const { user } = this.props;

		// Check if client has uploaded a logo
		const clientLogo = user.get("logoImage") != null && user.get("logoImage") != "";

		return (
			<Fragment>
				<h6 className="dropdown-header text-capitalize">
					{clientLogo ? <img src={user.get("logoImage")} height="32" /> : <span className="text-capitalize">{`${user.get("clientName")}`}</span>}
				</h6>
				<div className="dropdown-divider" />
			</Fragment>
		);
	}
}

NavProfileMenuLogo.propTypes = {
	user: PropTypes.object
};

export default User(NavProfileMenuLogo);
