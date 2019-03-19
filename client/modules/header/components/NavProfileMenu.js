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

	componentDidMount() {
		this._isMounted = true;
	}

	componentWillUnmount() {
		this._isMounted = false;
	}

	showMenu(evt) {
		evt.preventDefault();

		if (this._isMounted) {
			this.setState({ menuVisible: true }, () => {
				document.addEventListener("click", this.closeMenu);
			});
		}
	}

	closeMenu() {
		if (this._isMounted) {
			this.setState({ menuVisible: false }, () => {
				document.removeEventListener("click", this.closeMenu);
			});
		}
	}

	render() {
		const { user, children } = this.props;
		const { menuVisible } = this.state;

		return (
			<li className="nav-item dropdown">
				<Link to="/" className={`nav-link shadow-none m-1 ${menuVisible ? "active" : ""}`} aria-haspopup="true" aria-expanded={menuVisible ? "true" : "false"} onClick={this.showMenu}>
					<span className="mr-2 align-middle text-capitalize dropdown-toggle d-none d-md-inline-block">{`${user.get("firstName")} ${user.get("lastName")}`}</span>
					<div className="avatar small rounded-circle d-inline-block">
						<img src={user.get("profilePhoto") || require("distribution/images/avatar.svg")} className="rounded-circle" />
					</div>
				</Link>
				<div className={`dropdown-menu dropdown-menu-right position-absolute ${menuVisible ? "d-block" : ""}`} data-no-collapse="true">
					{children}
				</div>
			</li>
		);
	}
}

NavProfileMenu.propTypes = {
	user: PropTypes.object,
	children: PropTypes.array
};

export default User(NavProfileMenu);
