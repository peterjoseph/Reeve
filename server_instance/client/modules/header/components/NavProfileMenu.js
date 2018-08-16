import React, { Component } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";

import User from "common/components/User";

class NavProfileMenu extends Component {
	constructor() {
		super();

		this.state = {
			menuVisible: false
		};

		this.showMenu = this.showMenu.bind(this);
		this.closeMenu = this.closeMenu.bind(this);
	}

	showMenu(evt) {
		evt.preventDefault();

		this.setState({ menuVisible: true }, () => {
			document.addEventListener("click", this.closeMenu);
		});
	}

	closeMenu() {
		this.setState({ menuVisible: false }, () => {
			document.removeEventListener("click", this.closeMenu);
		});
	}

	render() {
		const { user, children } = this.props;
		const { menuVisible } = this.state;

		return (
			<li className="nav-item dropdown">
				<Link to="/" className={`nav-link ${menuVisible ? "active" : ""}`} aria-haspopup="true" aria-expanded={menuVisible ? "true" : "false"} onClick={this.showMenu}>
					<span className="mr-2 text-capitalize dropdown-toggle">{`${user.get("firstName")} ${user.get("lastName")}`}</span>
					<div className="header-profile-icon rounded-circle d-inline-block">
						<img src={user.get("profilePhoto") || require("distribution/images/avatar.png")} className="rounded-circle" />
					</div>
				</Link>
				<div className={`dropdown-menu dropdown-menu-right ${menuVisible ? "d-block" : ""}`}>{children}</div>
			</li>
		);
	}
}

NavProfileMenu.propTypes = {
	user: PropTypes.object,
	children: PropTypes.array
};

export default User(NavProfileMenu);
