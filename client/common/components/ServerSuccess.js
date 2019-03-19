import React, { Component } from "react";
import PropTypes from "prop-types";
import { withRouter } from "react-router-dom";
import queryString from "query-string";
import equal from "deep-equal";

class ServerSuccess extends Component {
	render() {
		const { history, path, message } = this.props;

		const query = queryString.parse(history.location.search);

		// Show success message if query string matches path object
		if (message && equal(query, path) === true) {
			return <div className="alert alert-success rounded-0">{message}</div>;
		} else {
			return null;
		}
	}
}

ServerSuccess.propTypes = {
	history: PropTypes.object,
	path: PropTypes.object,
	message: PropTypes.oneOfType([PropTypes.string, PropTypes.object])
};

export default withRouter(ServerSuccess);
