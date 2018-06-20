import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import PropTypes from "prop-types";
import { BrowserRouter, Switch } from "react-router-dom";
import { t } from "~/shared/translations/i18n";

import Router from "./Router";

import { AUTHENTICATION, loginUser } from "./common/store/reducers/authentication.js";

class App extends Component {
	// Set state to loading
	// Check browser
	// Fetch security token from local storage
	// Attempt login
	// Redirect to correct subdomain if valid
	// Build user model
	// Set language locale if feature available
	// Logout if login failed
	// Display login screen on failure

	render() {
		const { logInStatus } = this.props;

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
