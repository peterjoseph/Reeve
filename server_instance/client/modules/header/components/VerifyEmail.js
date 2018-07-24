import React, { Component } from "react";
import PropTypes from "prop-types";
import { notify } from "react-notify-toast";
import { t } from "shared/translations/i18n";

class VerifyEmail extends Component {
	constructor(props) {
		super(props);

		this.state = {
			emailSent: false
		};

		this.showNotification = this.showNotification.bind(this);
		this.resendVerifyEmail = this.resendVerifyEmail.bind(this);
	}

	showNotification() {
		notify.show(
			<span>
				<div>{t("components.authentication.verifyEmailNotification.welcomeEmailSent", { firstName: this.props.user.get("firstName"), email: this.props.user.get("emailAddress") })}</div>
				<div>
					{t("components.authentication.verifyEmailNotification.clickLink")}
					<span>
						<button
							type="button"
							className={`btn ${this.state.emailSent ? "btn-default" : "btn-warning"} btn-sm p-1 ml-2 ${this.state.emailSent && "disabled"}`}
							onClick={this.resendVerifyEmail}
							aria-disabled={this.state.emailSent ? "true" : "false"}
						>
							{this.state.emailSent ? t("action.emailSent") : t("action.resendEmail")}
						</button>
					</span>
				</div>
			</span>,
			"warning",
			-1
		);
	}

	resendVerifyEmail(evt) {
		evt.preventDefault(); // Prevent page refresh

		notify.hide();

		this.setState({ emailSent: true });

		this.showNotification();
	}

	render() {
		if (!this.props.user.get("emailVerified")) {
			this.showNotification();
		}
		return null;
	}
}

VerifyEmail.propTypes = {
	user: PropTypes.object
};

export default VerifyEmail;
