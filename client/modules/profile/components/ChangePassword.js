import React, { Component } from "react";
import PropTypes from "prop-types";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

import { REDUX_STATE } from "shared/constants";
import validate from "shared/validation/validate";
import { t } from "shared/translations/i18n";
import { changeUserPassword } from "shared/validation/profile";

import { PROFILE, CHANGE_PASSWORD_REJECTED, changePassword } from "common/store/reducers/profile.js";

import User from "common/components/User";
import InputField from "common/components/inputs/InputField";
import ServerSuccess from "common/components/ServerSuccess";
import ServerError from "common/components/ServerError";

class ChangePassword extends Component {
	constructor(props) {
		super(props);

		this.state = {
			currentPassword: "",
			newPassword: "",
			confirmPassword: "",
			loading: false,
			validationErrors: null,
			serverError: null
		};

		this.changePassword = this.changePassword.bind(this);
		this.changeField = this.changeField.bind(this);
	}

	changeField(evt) {
		this.setState({ [evt.target.name]: evt.target.value });
	}

	changePassword(evt) {
		evt.preventDefault(); // Prevent page refresh

		this.setState({
			loading: true,
			validationErrors: null,
			serverError: null
		});

		const body = {
			currentPassword: this.state.currentPassword,
			newPassword: this.state.newPassword,
			confirmPassword: this.state.confirmPassword
		};

		// Validate input parameters
		const valid = validate(body, changeUserPassword());
		if (valid != null) {
			this.setState({
				loading: false,
				validationErrors: valid
			});
		} else {
			this.props.changePassword(body).then(result => {
				if (result.type === CHANGE_PASSWORD_REJECTED) {
					this.setState({
						loading: false,
						serverError: result.payload
					});
				} else {
					this.setState({
						currentPassword: "",
						newPassword: "",
						confirmPassword: "",
						loading: false
					});
					this.props.history.push("/profile?changepassword=success");
				}
			});
		}
	}

	render() {
		const { currentPassword, newPassword, confirmPassword, loading, validationErrors, serverError } = this.state;
		const { loadProfileStatus, changePasswordStatus } = this.props;

		const userProfileLoading = loadProfileStatus !== REDUX_STATE.FULFILLED;
		const disabled = userProfileLoading || loading;

		const successMessage = changePasswordStatus === REDUX_STATE.FULFILLED && !serverError && !validationErrors;

		return (
			<div>
				{successMessage && <ServerSuccess path={{ changepassword: "success" }} message={t("success.changePassword")} />}
				<ServerError error={serverError} />
				<InputField
					label={t("components.profile.currentPassword")}
					name={"currentPassword"}
					id={"currentPassword"}
					value={currentPassword}
					type={"password"}
					ariaLabel={t("components.profile.currentPassword")}
					onChange={this.changeField}
					required
					disabled={disabled}
					error={validationErrors}
				/>
				<InputField
					label={t("components.profile.newPassword")}
					name={"newPassword"}
					id={"newPassword"}
					value={newPassword}
					type={"password"}
					ariaLabel={t("components.profile.newPassword")}
					onChange={this.changeField}
					required
					disabled={disabled}
					error={validationErrors}
				/>
				<InputField
					label={t("components.profile.confirmNewPassword")}
					name={"confirmPassword"}
					id={"confirmPassword"}
					value={confirmPassword}
					type={"password"}
					ariaLabel={t("components.profile.confirmNewPassword")}
					onChange={this.changeField}
					required
					disabled={disabled}
					error={validationErrors}
				/>
				{t("components.profile.passwordLengthRequirement")}
				<button type="submit" className={"btn btn-primary btn-sm btn-block mt-4 p-3"} onClick={this.changePassword} disabled={disabled}>
					{t("components.profile.changePassword")}
				</button>
			</div>
		);
	}
}

ChangePassword.propTypes = {
	history: PropTypes.object,
	user: PropTypes.object,
	loadProfileStatus: PropTypes.string,
	changePassword: PropTypes.func,
	changePasswordStatus: PropTypes.string
};

function mapStateToProps(state) {
	return {
		changePasswordStatus: state.getIn([PROFILE, "changePassword", "status"]),
		loadProfileStatus: state.getIn([PROFILE, "loadProfile", "status"])
	};
}

function mapDispatchToProps(dispatch) {
	return {
		changePassword: bindActionCreators(changePassword, dispatch)
	};
}

export default User(
	withRouter(
		connect(
			mapStateToProps,
			mapDispatchToProps
		)(ChangePassword)
	)
);
