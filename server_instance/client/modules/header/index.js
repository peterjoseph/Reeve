import React, { Fragment, Component } from "react";
import PropTypes from "prop-types";

import User from "common/components/User";
import VerifyEmail from "./components/VerifyEmail";

import NavLogo from "./components/NavLogo";
import NavMenuLink from "./components/NavMenuLink";
import NavProfileMenu from "./components/NavProfileMenu";
import NavDropdownLink from "./components/NavDropdownLink";

class Header extends Component {
	render() {
		const { user } = this.props;

		// Hide header if user is not logged in
		if (!user || !user.get("userId")) {
			return null;
		}

		return (
			<Fragment>
				<VerifyEmail user={user} />
				<nav className="navbar navbar-expand-lg bg-primary navbar-dark px-2 py-1">
					<NavLogo />
					<div className="navbar-nav-scroll">
						<ul className="navbar-nav bd-navbar-nav flex-row">
							<NavMenuLink title={"Home"} route={"/"} />
							<NavMenuLink title={"Activity"} route={"/activity"} />
							<NavMenuLink title={"Contacts"} route={"/contacts"} />
						</ul>
					</div>
					<ul className="navbar-nav flex-row ml-md-auto d-none d-md-flex">
						<NavProfileMenu>
							<NavDropdownLink />
							<NavDropdownLink />
							<NavDropdownLink />
						</NavProfileMenu>
					</ul>
				</nav>
			</Fragment>
		);
	}
}

Header.propTypes = {
	user: PropTypes.object
};

export default User(Header);
