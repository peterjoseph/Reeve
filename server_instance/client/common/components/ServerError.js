import React from "react";
import PropTypes from "prop-types";

class ServerError extends React.Component {
	render() {
		const { errors } = this.props;

		if (typeof errors === "string" || errors instanceof String) {
			return <div className="alert alert-danger">{errors}</div>;
		}

		if (typeof errors === "object" || errors instanceof Object) {
			let serverErrors = [];
			for (const key of Object.keys(errors)) {
				serverErrors.push(<div key={key}>{errors[key]}</div>);
			}
			if (serverErrors.length > 0) {
				return <div className="alert alert-danger">{serverErrors}</div>;
			}
		}

		return null;
	}
}

ServerError.propTypes = {
	errors: PropTypes.oneOfType([PropTypes.string, PropTypes.object])
};

export default ServerError;
