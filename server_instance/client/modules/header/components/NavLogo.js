import React, { Fragment, Component } from "react";
import PropTypes from "prop-types";

import User from "common/components/User";

class Header extends Component {
	render() {
		const { user } = this.props;

		return (
			<a className="navbar-brand pl-2 mr-4" href="#">
				<img src={require("distribution/images/icon_32_white.png")} width="32" height="32" />
				<span className="ml-2 text-capitalize">{`${user.get("clientName")}`}</span>
			</a>
		);
	}
}

Header.propTypes = {
	user: PropTypes.object
};

export default User(Header);
