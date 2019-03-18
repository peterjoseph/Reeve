import React, { Component } from "react";
import PropTypes from "prop-types";
import { notify } from "react-notify-toast";
import { t } from "shared/translations/i18n";

import { resendVerifyEmail } from "client/api/authentication.js";

class VerifyEmail extends Component {
	constructor(props) {
		super(props);

		this.state = {
			emailSent: false
		};

		this.showNotification = this.showNotification.bind(this);
		this.resendVerifyEmail = this.resendVerifyEmail.bind(this);
	}

	componentDidMount() {
		if (!this.props.user.get("emailVerified")) {
			this.showNotification();
		}
	}

	showNotification() {
		notify.show(
			<span>
				<div>
					{t("components.authentication.verifyEmailNotification.welcomeEmailSent", { firstName: this.props.user.get("firstName"), email: this.props.user.get("emailAddress") })}
					<span>
						<button
							type="button"
							className={`btn btn-link btn-sm p-0 ml-2 ${this.state.emailSent && "disabled"}`}
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

		// Call API to send verify email
		resendVerifyEmail()
			.then(() => {
				this.setState({ emailSent: true });
				this.showNotification();
			})
			.catch(() => {
				this.setState({ emailSent: false });
				this.showNotification();
			});

		// Hide existing notification as we need to re-render
		notify.hide();
	}

	render() {
		return null;
	}
}

VerifyEmail.propTypes = {
	user: PropTypes.object
};

export default VerifyEmail;
