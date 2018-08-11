import React, { Component } from "react";
import PropTypes from "prop-types";
import { withRouter } from "react-router-dom";
import { notify } from "react-notify-toast";
import queryString from "query-string";
import equal from "deep-equal";

class SuccessNotification extends Component {
	render() {
		const { history, path, message } = this.props;

		const query = queryString.parse(history.location.search);

		// Show success notification if query string matches path object
		if (message && equal(query, path) === true) {
			notify.show(<span>{message}</span>, "success");
		}

		return null;
	}
}

SuccessNotification.propTypes = {
	history: PropTypes.object,
	path: PropTypes.object,
	message: PropTypes.oneOfType([PropTypes.string, PropTypes.object])
};

export default withRouter(SuccessNotification);
