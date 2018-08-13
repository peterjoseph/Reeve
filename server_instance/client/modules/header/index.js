import React, { Fragment, Component } from "react";
import PropTypes from "prop-types";

import User from "common/components/User";
import VerifyEmail from "./components/VerifyEmail";

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
				<nav className="navbar navbar-expand-lg navbar-light bg-light px-2 py-1">
					<a className="navbar-brand" href="#">
						<img src={require("distribution/images/icon_32.png")} width="32" height="32" />
						<span className="ml-2 text-capitalize">{`${user.get("clientName")}`}</span>
					</a>
					<div className="navbar-nav-scroll">
						<ul className="navbar-nav bd-navbar-nav flex-row">
							<li className="nav-item active">
								<a className="nav-link" href="#">
									Home <span className="sr-only">(current)</span>
								</a>
							</li>
							<li className="nav-item">
								<a className="nav-link" href="#">
									Features
								</a>
							</li>
							<li className="nav-item">
								<a className="nav-link" href="#">
									Pricing
								</a>
							</li>
							<li className="nav-item dropdown">
								<a className="nav-link dropdown-toggle" href="#" id="navbarDropdownMenuLink" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
									Dropdown link
								</a>
								<div className="dropdown-menu" aria-labelledby="navbarDropdownMenuLink">
									<a className="dropdown-item" href="#">
										Action
									</a>
									<a className="dropdown-item" href="#">
										Another action
									</a>
									<a className="dropdown-item" href="#">
										Something else here
									</a>
								</div>
							</li>
						</ul>
					</div>
					<ul className="navbar-nav flex-row ml-md-auto d-none d-md-flex">
						<li className="nav-item dropdown">
							<a className="nav-link" href="#" id="navbarDropdownMenuLink" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
								<span className="mr-2 text-capitalize">{`${user.get("firstName")} ${user.get("lastName")}`}</span>
								<div className="rounded-circle d-inline-block" style={{ width: "36px", height: "36px" }}>
									<img src="https://placehold.it/36" className="rounded-circle" />
								</div>
							</a>
							<div className="dropdown-menu dropdown-menu-right" aria-labelledby="navbarDropdownMenuLink">
								<a className="dropdown-item" href="#">
									Action
								</a>
								<a className="dropdown-item" href="#">
									Another action
								</a>
								<a className="dropdown-item" href="#">
									Something else here
								</a>
							</div>
						</li>
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
