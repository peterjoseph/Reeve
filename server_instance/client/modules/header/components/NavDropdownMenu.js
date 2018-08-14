import React, { Fragment, Component } from "react";
import PropTypes from "prop-types";

import User from "common/components/User";

class NavDropdownMenu extends Component {
	render() {
		const { user, children } = this.props;

		return (
			<li className="nav-item dropdown">
				<a className="nav-link" href="#" id="navbarDropdownMenuLink" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
					<span className="mr-2 text-capitalize">{`${user.get("firstName")} ${user.get("lastName")}`}</span>
					<div className="rounded-circle d-inline-block" style={{ width: "36px", height: "36px" }}>
						<img src="https://placehold.it/36" className="rounded-circle" />
					</div>
				</a>
				<div className="dropdown-menu dropdown-menu-right" aria-labelledby="navbarDropdownMenuLink">
					{children}
				</div>
			</li>
		);
	}
}

NavDropdownMenu.propTypes = {
	user: PropTypes.object,
	children: PropTypes.object
};

export default User(NavDropdownMenu);
