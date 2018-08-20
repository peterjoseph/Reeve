import React, { Component } from "react";
import PropTypes from "prop-types";
import { injectGlobal } from "react-emotion";

import User from "common/components/User";

class GlobalStyling extends Component {
	render() {
		const { user, children } = this.props;

		// Inject styles if user has loaded
		if (user !== null && user.get("userId") !== null) {
			injectGlobal``;
		} else {
			injectGlobal``;
		}
		return React.Children.only(children);
	}
}

GlobalStyling.propTypes = {
	children: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
	user: PropTypes.object
};

export default User(GlobalStyling);
