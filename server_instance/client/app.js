import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import PropTypes from "prop-types";
import bowser from "bowser";
import { notify } from "react-notify-toast";
import { t } from "~/shared/translations/i18n";
import { SERVER_DETAILS } from "~/shared/constants";

import Router from "./Router";
import Loading from "./common/components/Loading";

import { AUTHENTICATION, loginUser } from "./common/store/reducers/authentication";

class App extends Component {
	// Fetch security token from local storage
	// Attempt login
	// Redirect to correct subdomain if valid
	// Build user model from login data
	// Set language locale if feature available
	// Logout if login failed
	// Display login screen on failure

	constructor(props) {
		super(props);

		this.state = {
			loading: true
		};
	}

	componentDidMount() {
		// Check client is using a valid browser version
		this.browserVersionCheck();
	}

	browserVersionCheck() {
		const isSupported = bowser.check(SERVER_DETAILS.MINIMUM_BROWSER_VERSIONS);
		if (!isSupported) {
			notify.show(t("error.outdatedBrowser"), "warning", -1);
		}
	}

	render() {
		const { loading } = this.state;
		const { logInStatus } = this.props;

		if (loading === true) {
			return <Loading />;
		}

		return <Router />;
	}
}

App.propTypes = {
	logInStatus: PropTypes.string,
	loginUser: PropTypes.func
};

function mapStateToProps(state, props) {
	return {
		logInStatus: state.getIn([AUTHENTICATION, "userLogin", "status"])
	};
}

function mapDispatchToProps(dispatch) {
	return {
		loginUser: bindActionCreators(loginUser, dispatch)
	};
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
