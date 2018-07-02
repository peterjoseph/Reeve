import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import PropTypes from "prop-types";
import bowser from "bowser";
import { notify } from "react-notify-toast";
import fetch from "~/shared/utilities/fetch";
import { t } from "~/shared/translations/i18n";
import { SERVER_DETAILS, REDUX_STATE } from "~/shared/constants";

import Router from "./Router";
import Loading from "./common/components/Loading";

import { AUTHENTICATION, LOGIN_REJECTED, loginUser, loadUser } from "./common/store/reducers/authentication";
import { getToken, saveToken, clearToken } from "~/shared/utilities/securityToken";

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
		const isSupported = bowser.check(SERVER_DETAILS.MINIMUM_BROWSER_VERSIONS);
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
				this.props.loadUser().then(() => {
					this.setState({
						loading: false
					});
				});
			}
		});
	}

	render() {
		return <Fragment>{this.state.loading ? <Loading /> : <Router {...this.props} />}</Fragment>;
	}
}

App.propTypes = {
	loginUser: PropTypes.func,
	loadUser: PropTypes.func,
	logInStatus: PropTypes.string,
	userStatus: PropTypes.string,
	logInData: PropTypes.object,
	userData: PropTypes.object
};

function mapStateToProps(state, props) {
	return {
		logInStatus: state.getIn([AUTHENTICATION, "userLogin", "status"]),
		logInData: state.getIn([AUTHENTICATION, "userLogin", "payload"]),
		userStatus: state.getIn([AUTHENTICATION, "user", "status"]),
		userData: state.getIn([AUTHENTICATION, "user", "payload"])
	};
}

function mapDispatchToProps(dispatch) {
	return {
		loginUser: bindActionCreators(loginUser, dispatch),
		loadUser: bindActionCreators(loadUser, dispatch)
	};
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
