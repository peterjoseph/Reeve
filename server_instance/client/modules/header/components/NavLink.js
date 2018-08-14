import React, { Fragment, Component } from "react";
import PropTypes from "prop-types";

import User from "common/components/User";

class NavLink extends Component {
	render() {
		const { user } = this.props;

		return (
			<li className="nav-item active">
				<a className="nav-link" href="#">
					Home <span className="sr-only">(current)</span>
				</a>
			</li>
		);
	}
}

NavLink.propTypes = {
	user: PropTypes.object
};

export default User(NavLink);
