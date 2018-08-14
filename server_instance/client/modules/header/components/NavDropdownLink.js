import React, { Fragment, Component } from "react";
import PropTypes from "prop-types";

import User from "common/components/User";

class NavDropdownLink extends Component {
	render() {
		const { user } = this.props;

		return (
			<a className="dropdown-item" href="#">
				Action
			</a>
		);
	}
}

NavDropdownLink.propTypes = {
	user: PropTypes.object
};

export default User(NavDropdownLink);
