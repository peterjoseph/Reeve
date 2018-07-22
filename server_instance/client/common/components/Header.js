import React, { Component } from "react";
import PropTypes from "prop-types";

import User from "common/components/User";

class Header extends Component {
	render() {
		const { user } = this.props;

		// Hide header if user is not logged in
		if (!user || !user.get("userId")) {
			return null;
		}

		return <div>Header</div>;
	}
}

Header.propTypes = {
	user: PropTypes.object
};

export default User(Header);
