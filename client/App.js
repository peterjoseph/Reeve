import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import PropTypes from "prop-types";
import bowser from "bowser";
import { notify } from "react-notify-toast";
import fetch from "common/fetch";
import { t, activeLanguage } from "shared/translations/i18n";
import { MINIMUM_BROWSER_VERSIONS, REDUX_STATE } from "shared/constants";
import { variableExists } from "shared/utilities/filters";

import Router from "./Router";
import GlobalStyling from "common/components/GlobalStyling";
import Loading from "common/components/Loading";

import { AUTHENTICATION, LOGIN_REJECTED, LOAD_USER_REJECTED, loginUser, loadUser } from "./common/store/reducers/authentication";
import { LANGUAGE, changeLanguage } from "common/store/reducers/language.js";
import { getToken, saveToken, clearToken } from "shared/utilities/securityToken";

class App extends Component {
	constructor(props) {
		super(props);

		this.state = {
			loading: true
		};
	}

	componentDidMount() {
		// Check client is using a valid browser version
		this.browserVersionCheck();
		// Attempt user login
		this.login();
	}

	static getDerivedStateFromProps(nextProps, prevState) {
		if (nextProps.logInStatus === prevState.logInStatus) {
			return null;
		}
		// Store subdomain in state if valid
		if (nextProps.logInStatus === REDUX_STATE.FULFILLED) {
			// Store token in browser
			if (nextProps.logInData.get("token") != null) {
				saveToken(nextProps.logInData.get("token"), nextProps.logInData.get("keepSignedIn"));
				fetch.setSecurityToken(nextProps.logInData.get("token"));
			}
		}
		return null;
	}

	browserVersionCheck() {
		const isSupported = bowser.check(MINIMUM_BROWSER_VERSIONS);
		if (!isSupported) {
			notify.show(t("error.outdatedBrowser"), "warning", -1);
		}
	}

	login() {
		// Fetch security token from browser
		const token = getToken();

		// Set loaded to true and load route as unauthenticated
		if (token === null) {
			clearToken();
			this.setState({
				loading: false
			});
			return;
		} else {
			// Pass the token to fetch header
			fetch.setSecurityToken(token);
		}

		this.props.loginUser({ authToken: true }).then(result => {
			if (result.type === LOGIN_REJECTED) {
				clearToken(); // Clear security token if login rejected
				fetch.clearSecurityToken(); // Clear token in fetch header
				this.setState({
					loading: false
				});
			} else {
				this.props.loadUser().then(result => {
					if (result.type === LOAD_USER_REJECTED) {
						clearToken(); // Clear security token if user could not be loaded
						fetch.clearSecurityToken(); // Clear token in fetch header
						this.setState({
							loading: false
						});

						// Reload the web browser as loading the user failed
						window.location.reload;
						return;
					}

					// Load client specific default language
					const lng = result.payload.language;
					if (variableExists(lng) && activeLanguage() !== lng) {
						this.props.changeLanguage(lng);
					}

					// Loading is complete
					this.setState({
						loading: false
					});
				});
			}
		});
	}

	render() {
		const { activeLanguage } = this.props;
		return (
			<Fragment>
				{this.state.loading ? (
					<Loading />
				) : (
					<GlobalStyling key={activeLanguage}>
						<Router {...this.props} />
					</GlobalStyling>
				)}
			</Fragment>
		);
	}
}

App.propTypes = {
	loginUser: PropTypes.func,
	loadUser: PropTypes.func,
	logInStatus: PropTypes.string,
	userStatus: PropTypes.string,
	logInData: PropTypes.object,
	userData: PropTypes.object,
	changeLanguage: PropTypes.func
};

function mapStateToProps(state, props) {
	return {
		activeLanguage: state.getIn([LANGUAGE, "changeLanguage", "payload", "language"]),
		logInStatus: state.getIn([AUTHENTICATION, "userLogin", "status"]),
		logInData: state.getIn([AUTHENTICATION, "userLogin", "payload"]),
		userStatus: state.getIn([AUTHENTICATION, "user", "status"]),
		userData: state.getIn([AUTHENTICATION, "user", "payload"])
	};
}

function mapDispatchToProps(dispatch) {
	return {
		loginUser: bindActionCreators(loginUser, dispatch),
		loadUser: bindActionCreators(loadUser, dispatch),
		changeLanguage: bindActionCreators(changeLanguage, dispatch)
	};
}

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(App);
