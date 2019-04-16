import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import User from "common/components/User";
import { t } from "shared/translations/i18n";
import { variableExists } from "shared/utilities/filters";
import { REDUX_STATE } from "shared/constants";
import { AUTHENTICATION, resendVerifyEmail } from "common/store/reducers/authentication";

class VerifyEmail extends Component {
	constructor(props) {
		super(props);

		this.state = {
			language: "en"
		};

		this.resendVerifyEmail = this.resendVerifyEmail.bind(this);
	}

	static getDerivedStateFromProps(nextProps, prevState) {
		if (nextProps.user.get("language") !== prevState.language) {
			return {
				language: nextProps.user.get("language")
			};
		}
		return null;
	}

	resendVerifyEmail(evt) {
		evt.preventDefault(); // Prevent page refresh

		// Call API to send verify email
		this.props.resendVerifyEmail();
	}

	render() {
		const { user, resendVerifyEmailStatus } = this.props;

		// Hide header if user is not logged in
		if (!this.props.user || !variableExists(user.get("userId"))) {
			return null;
		}

		// Hide header if email has been verified
		if (this.props.user.get("emailVerified")) {
			return null;
		}

		const emailSent = resendVerifyEmailStatus === REDUX_STATE.FULFILLED;

		return (
			<div className={"alert alert-warning text-center mb-0 border-0 rounded-0"}>
				{t("components.authentication.verifyEmailNotification.welcomeEmailSent", { firstName: user.get("firstName"), email: user.get("emailAddress") })}
				<span>
					<button type="button" className={`btn btn-link btn-sm p-0 ml-2 ${emailSent && "disabled"}`} onClick={this.resendVerifyEmail} aria-disabled={emailSent ? "true" : "false"}>
						{emailSent ? t("action.emailSent") : t("action.resendEmail")}
					</button>
				</span>
			</div>
		);
	}
}

VerifyEmail.propTypes = {
	user: PropTypes.object,
	resendVerifyEmail: PropTypes.func,
	resendVerifyEmailStatus: PropTypes.string
};

function mapStateToProps(state, props) {
	return {
		resendVerifyEmailStatus: state.getIn([AUTHENTICATION, "resendVerifyEmail", "status"])
	};
}

function mapDispatchToProps(dispatch) {
	return {
		resendVerifyEmail: bindActionCreators(resendVerifyEmail, dispatch)
	};
}

export default User(
	connect(
		mapStateToProps,
		mapDispatchToProps
	)(VerifyEmail)
);
