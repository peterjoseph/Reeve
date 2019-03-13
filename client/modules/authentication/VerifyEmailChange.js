import { Component } from "react";
import PropTypes from "prop-types";
import queryString from "query-string";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { withRouter } from "react-router-dom";
import { notify } from "react-notify-toast";

import { t } from "shared/translations/i18n";
import { extractSubdomain } from "shared/utilities/subdomain";
import User from "common/components/User";
import { VALIDATE_WORKSPACE_URL_REJECTED, validateWorkspaceURL } from "common/store/reducers/authentication.js";
import { VERIFY_EMAIL_CHANGE_REJECTED, verifyUserEmailChange } from "common/store/reducers/profile.js";

class VerifyEmailChange extends Component {
	componentDidMount() {
		this.VerifyEmailChange();
	}

	render() {
		return null;
	}

	VerifyEmailChange() {
		const subdomain = extractSubdomain(window.location.href);
		this.props.validateWorkspaceURL(subdomain).then(result => {
			if (result.type === VALIDATE_WORKSPACE_URL_REJECTED) {
				this.props.history.replace("/");
				return;
			}

			// Verify Code
			const query = queryString.parse(this.props.history.location.hash);
			const code = query.code;

			// Create body component to send to back-end
			const body = {
				code: code,
				workspaceURL: subdomain
			};

			// Check if user exists and isLoggedIn
			if (this.props.user && this.props.user.get("userId")) {
				body.userId = this.props.user.get("userId");
			}

			// Verify User Email
			this.props.verifyUserEmailChange(body).then(result => {
				// Hide existing notification as we need to re-render
				notify.hide();

				// Display error notification if the email change cannot be completed successfully
				if (result.type === VERIFY_EMAIL_CHANGE_REJECTED) {
					notify.show(`${t("error.verifyEmailChange")} (${result.payload.message})`, "error", -1);
					this.props.history.replace("/");
					return;
				}

				// Display success notification
				notify.show(t("success.verifyEmailChange"), "success");
				this.props.history.replace("/");
			});
		});
	}
}

VerifyEmailChange.propTypes = {
	history: PropTypes.object,
	user: PropTypes.object,
	validateWorkspaceURL: PropTypes.func,
	verifyUserEmailChange: PropTypes.func
};

function mapDispatchToProps(dispatch) {
	return {
		verifyUserEmailChange: bindActionCreators(verifyUserEmailChange, dispatch),
		validateWorkspaceURL: bindActionCreators(validateWorkspaceURL, dispatch)
	};
}

export default withRouter(
	User(
		connect(
			null,
			mapDispatchToProps
		)(VerifyEmailChange)
	)
);
