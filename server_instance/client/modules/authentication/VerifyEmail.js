import { Component } from "react";
import PropTypes from "prop-types";
import queryString from "query-string";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { withRouter } from "react-router-dom";
import { extractSubdomain } from "shared/utilities/subdomain";

import { VALIDATE_WORKSPACE_URL_REJECTED, VERIFY_EMAIL_REJECTED, validateWorkspaceURL, verifyUserEmail } from "../../common/store/reducers/authentication.js";

class VerifyEmail extends Component {
	constructor(props) {
		super(props);
	}

	componentDidMount() {
		const subdomain = extractSubdomain(window.location.href);
		this.props.validateWorkspaceURL(subdomain).then(result => {
			if (result.type === VALIDATE_WORKSPACE_URL_REJECTED) {
				this.props.history.replace("/");
			}

			// Verify Code
			const query = queryString.parse(this.props.history.location.hash);
			const code = query.code;

			// Verify User Email
			this.props
				.verifyUserEmail({
					code: code,
					workspaceURL: subdomain
				})
				.then(result => {
					if (result.type === VERIFY_EMAIL_REJECTED) {
						this.props.history.replace("/");
					}
				});
		});
	}

	render() {
		return null;
	}
}

VerifyEmail.propTypes = {
	history: PropTypes.object,
	validateWorkspaceURL: PropTypes.func,
	verifyUserEmail: PropTypes.func
};

function mapDispatchToProps(dispatch) {
	return {
		verifyUserEmail: bindActionCreators(verifyUserEmail, dispatch),
		validateWorkspaceURL: bindActionCreators(validateWorkspaceURL, dispatch)
	};
}

export default withRouter(connect(null, mapDispatchToProps)(VerifyEmail));
