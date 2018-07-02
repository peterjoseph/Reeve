import React, { Component } from "react";
import PropTypes from "prop-types";
import { Route } from "react-router";

import User from "./User";

class RedirectComponent extends Component {
	render() {
		return <Route {...this.props} />;
	}
}

RedirectComponent.propTypes = {
	user: PropTypes.object
};

export default User(RedirectComponent);
