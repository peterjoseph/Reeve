import React, { Fragment, Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { notify } from "react-notify-toast";

import { t } from "shared/translations/i18n";
import fetch from "shared/utilities/fetch";
import { clearToken } from "shared/utilities/securityToken";
import { AUTHENTICATION, LOGOUT_REJECTED, logoutUser } from "common/store/reducers/authentication";

import User from "common/components/User";
import VerifyEmail from "./components/VerifyEmail";

import NavLogo from "./components/NavLogo";
import NavMenuLink from "./components/NavMenuLink";
import NavProfileMenu from "./components/NavProfileMenu";
import NavDropdownLink from "./components/NavDropdownLink";

class Header extends Component {
	constructor(props) {
		super(props);

		this.logout = this.logout.bind(this);
	}

	logout(evt) {
		evt.preventDefault();

		// Remove user session from store
		this.props.logoutUser().then(result => {
			if (result.type === LOGOUT_REJECTED) {
				// Display error notification
				notify.show(t("error.logout"), "error");
			} else {
				clearToken(); // Clear security token in browser
				fetch.clearSecurityToken(); // Clear token in fetch header

				// Refresh Browser Window
				window.location.hash = "";
				window.location.reload(true);
			}
		});
	}

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
							<NavMenuLink title={t("label.dashboard")} route={"/"} />
							<NavMenuLink title={t("label.activity")} route={"/activity"} />
							<NavMenuLink title={t("label.contacts")} route={"/contacts"} />
						</ul>
					</div>
					<ul className="navbar-nav bd-navbar-nav flex-row ml-md-auto d-none d-md-flex">
						<NavProfileMenu>
							<NavDropdownLink title={t("label.profile")} route={"/profile"} />
							<NavDropdownLink title={t("label.billing")} route={"/billing"} />
							<NavDropdownLink title={t("label.settings")} route={"/settings"} />
							<div className="dropdown-divider" />
							<button className={"btn btn-link dropdown-item"} onClick={this.logout}>
								{t("action.logout")}
							</button>
						</NavProfileMenu>
					</ul>
				</nav>
			</Fragment>
		);
	}
}

Header.propTypes = {
	user: PropTypes.object,
	logoutUser: PropTypes.func,
	logoutStatus: PropTypes.string
};

function mapStateToProps(state, props) {
	return {
		logoutStatus: state.getIn([AUTHENTICATION, "userLogout", "status"])
	};
}

function mapDispatchToProps(dispatch) {
	return {
		logoutUser: bindActionCreators(logoutUser, dispatch)
	};
}

export default User(connect(mapStateToProps, mapDispatchToProps)(Header));
