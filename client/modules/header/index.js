import React, { Fragment, Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { notify } from "react-notify-toast";

import { ROLE_TYPE, FEATURES, SUBSCRIPTION_TYPE } from "shared/constants";
import { t } from "shared/translations/i18n";
import fetch from "common/fetch";
import { clearToken } from "shared/utilities/securityToken";
import { AUTHENTICATION, LOGOUT_REJECTED, logoutUser } from "common/store/reducers/authentication";

import User from "common/components/User";
import VerifyEmail from "./components/VerifyEmail";

import NavLogo from "./components/NavLogo";
import NavMenuLink from "./components/NavMenuLink";
import NavProfileMenu from "./components/NavProfileMenu";
import NavProfileMenuLogo from "./components/NavProfileMenuLogo";
import NavDropdownLink from "./components/NavDropdownLink";
import ActiveTrial from "./components/ActiveTrial";
import HelpCaller from "./components/HelpCaller";

import BurgerMenu from "common/media/icons/BurgerMenu";
import ProfileIcon from "common/media/icons/Profile";
import CreditCardIcon from "common/media/icons/CreditCard";
import SettingsIcon from "common/media/icons/Settings";
import LogoutIcon from "common/media/icons/Logout";

class Header extends Component {
	constructor(props) {
		super(props);

		this.state = {
			menuVisible: false
		};

		this.showMenu = this.showMenu.bind(this);
		this.closeMenu = this.closeMenu.bind(this);
		this.logout = this.logout.bind(this);
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
				const url = `${BUILD_PROTOCOL}://${this.props.user.get("workspaceURL")}.${BUILD_DOMAINPATH}/signin`;
				window.location.replace(url);
			}
		});
	}

	render() {
		const { user } = this.props;
		const { menuVisible } = this.state;

		// Hide header if user is not logged in
		if (!user || !user.get("userId")) {
			return null;
		}

		return (
			<Fragment>
				<VerifyEmail user={user} />
				<nav className="navbar navbar-expand-md bg-primary navbar-dark px-2 py-0">
					<NavLogo />
					<ul className="navbar-nav bd-navbar-nav flex-row ml-auto d-flex order-md-1">
						<ActiveTrial />
						<HelpCaller />
						<NavProfileMenu>
							<NavProfileMenuLogo />
							{user.get("subscriptionActive") && (
								<Fragment>
									<NavDropdownLink title={t("label.profile")} route={"/profile"} />
									<NavDropdownLink
										title={t("label.billing")}
										route={"/billing"}
										role={[ROLE_TYPE.OWNER, ROLE_TYPE.FINANCE]}
										feature={[FEATURES.BILLING]}
										subscription={[SUBSCRIPTION_TYPE.TRIAL, SUBSCRIPTION_TYPE.BASIC]}
									/>
									<NavDropdownLink title={t("label.settings")} route={"/settings"} />
									<div className="dropdown-divider" />
								</Fragment>
							)}
							<button className={"btn btn-link dropdown-item"} onClick={this.logout}>
								{t("action.logout")}
							</button>
						</NavProfileMenu>
					</ul>
					<button className="navbar-toggler border-0 ml-2" type="button" aria-expanded="false" onClick={this.showMenu}>
						<BurgerMenu width="16px" height="16px" />
					</button>
					{user.get("subscriptionActive") && (
						<Fragment>
							<div className={`collapse navbar-collapse ${menuVisible ? "show" : ""}`}>
								<div className="navbar-nav-scroll">
									<ul className="navbar-nav bd-navbar-nav flex-md-row">
										<NavMenuLink title={t("label.dashboard")} route={"/"} isExact={true} />
										<NavMenuLink title={t("label.profile")} route={"/profile"} isExact={true} />
									</ul>
								</div>
							</div>
						</Fragment>
					)}
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

export default User(
	connect(
		mapStateToProps,
		mapDispatchToProps
	)(Header)
);
