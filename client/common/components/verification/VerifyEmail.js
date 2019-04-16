import { Component } from "react";
import PropTypes from "prop-types";
import queryString from "query-string";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { withRouter } from "react-router-dom";
import { notify } from "react-notify-toast";

import { t } from "shared/translations/i18n";
import { extractSubdomain } from "shared/utilities/domains";
import User from "common/components/User";
import { VALIDATE_WORKSPACE_URL_REJECTED, VERIFY_EMAIL_REJECTED, validateWorkspaceURL, verifyUserEmail, LOAD_USER_REJECTED, loadUser } from "common/store/reducers/authentication.js";

class VerifyEmail extends Component {
	componentDidMount() {
		this.verifyEmail();
	}

	verifyEmail() {
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
			this.props.verifyUserEmail(body).then(result => {
				// Hide existing notification as we need to re-render
				notify.hide();

				// Display error notification if the email cannot be verified
				if (result.type === VERIFY_EMAIL_REJECTED) {
					notify.show(`${t("error.verifyEmail")} (${result.payload.message})`, "error");
					this.props.history.replace("/");
					return;
				}

				// Reload user if logged in and success
				if (body.userId !== null) {
					this.props.loadUser().then(loadUserResult => {
						if (loadUserResult.type === LOAD_USER_REJECTED) {
							// Reload the web browser as loading the user failed
							window.location.reload;
							return;
						}
						// Display success notification
						notify.show(t("success.verifyEmail"), "success");
						this.props.history.replace("/");
						return;
					});
				}

				// Display success notification
				notify.show(t("success.verifyEmail"), "success");
				this.props.history.replace("/");
			});
		});
	}

	render() {
		return null;
	}
}

VerifyEmail.propTypes = {
	history: PropTypes.object,
	user: PropTypes.object,
	loadUser: PropTypes.func,
	validateWorkspaceURL: PropTypes.func,
	verifyUserEmail: PropTypes.func
};

function mapDispatchToProps(dispatch) {
	return {
		loadUser: bindActionCreators(loadUser, dispatch),
		verifyUserEmail: bindActionCreators(verifyUserEmail, dispatch),
		validateWorkspaceURL: bindActionCreators(validateWorkspaceURL, dispatch)
	};
}

export default withRouter(
	User(
		connect(
			null,
			mapDispatchToProps
		)(VerifyEmail)
	)
);
