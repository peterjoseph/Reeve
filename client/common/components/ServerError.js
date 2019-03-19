import React, { Component } from "react";
import PropTypes from "prop-types";
import { withRouter } from "react-router-dom";

import Alert from "common/components/Alert";
import { t } from "shared/translations/i18n";

class ServerError extends Component {
	render() {
		const { history, error, showMessage, showAlert } = this.props;

		if (showAlert && error && (error.status === 429 || error.status === 500)) {
			return (
				<Alert title={`${t("label.error")}: ${t("error.somethingWentWrong")}`} closeModal={() => history.push("/")}>
					{error.message}
				</Alert>
			);
		}

		if (showMessage && error && error.reason) {
			const reason = error.reason;
			if (typeof reason === "string" || reason instanceof String) {
				return <div className="alert alert-danger rounded-0">{reason}</div>;
			}

			if (typeof reason === "object" || reason instanceof Object) {
				let reasons = [];
				for (const key of Object.keys(reason)) {
					reasons.push(<div key={key}>{reason[key]}</div>);
				}
				if (reasons.length > 0) {
					return <div className="alert alert-danger rounded-0">{reasons}</div>;
				}
			}
		}

		return null;
	}
}

ServerError.defaultProps = {
	showMessage: true,
	showAlert: true,
	error: {}
};

ServerError.propTypes = {
	history: PropTypes.object,
	showMessage: PropTypes.bool,
	showAlert: PropTypes.bool,
	error: PropTypes.object
};

export default withRouter(ServerError);
