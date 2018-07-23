import React, { Component } from "react";
import PropTypes from "prop-types";
import { notify } from "react-notify-toast";

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
				<div>
					Hi {this.props.user.get("firstName")}, a welcome email was sent to {this.props.user.get("emailAddress")}.
				</div>
				<div>
					Please click the link in the email to verify your email address.
					<span>
						<button
							type="button"
							className={`btn btn-warning btn-sm ml-2 ${this.state.emailSent && "disabled"}`}
							onClick={this.resendVerifyEmail}
							aria-disabled={this.state.emailSent ? "true" : "false"}
						>
							{this.state.emailSent ? "Email Sent" : "Resend Email"}
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
