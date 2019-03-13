import React, { Component } from "react";
import PropTypes from "prop-types";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

import { REDUX_STATE } from "shared/constants";
import validate from "shared/validation/validate";
import { t } from "shared/translations/i18n";
import { updateUserProfile } from "shared/validation/profile";

import { PROFILE, UPDATE_PROFILE_REJECTED, updateProfile } from "common/store/reducers/profile.js";
import { LOAD_USER_REJECTED, loadUser } from "common/store/reducers/authentication";

import User from "common/components/User";
import InputField from "common/components/inputs/InputField";
import ServerSuccess from "common/components/ServerSuccess";
import ServerError from "common/components/ServerError";

class EditProfile extends Component {
	constructor(props) {
		super(props);

		this.state = {
			firstName: "",
			lastName: "",
			emailAddress: "",
			loading: false,
			validationErrors: null,
			serverError: null
		};

		this.updateProfile = this.updateProfile.bind(this);
		this.changeField = this.changeField.bind(this);
	}

	componentDidMount() {
		if (this.props.user) {
			this.setState({
				firstName: this.props.user.get("firstName"),
				lastName: this.props.user.get("lastName"),
				emailAddress: this.props.user.get("emailAddress")
			});
		}
	}

	changeField(evt) {
		this.setState({
			[evt.target.name]: evt.target.value
		});
	}

	updateProfile(evt) {
		evt.preventDefault(); // Prevent page refresh

		this.setState({
			loading: true,
			validationErrors: null,
			serverError: null
		});

		const body = {
			firstName: this.state.firstName,
			lastName: this.state.lastName,
			emailAddress: this.state.emailAddress
		};

		// Validate input parameters
		const valid = validate(body, updateUserProfile());
		if (valid != null) {
			this.setState({
				loading: false,
				validationErrors: valid
			});
		} else {
			this.props.updateProfile(body).then(result => {
				if (result.type === UPDATE_PROFILE_REJECTED) {
					this.setState({
						loading: false,
						serverError: result.payload
					});
				} else {
					this.props.loadUser().then(loadUserResult => {
						if (loadUserResult.type === LOAD_USER_REJECTED) {
							this.setState({
								loading: false
							});
							// Reload the web browser as loading the user failed
							window.location.reload;
							return;
						}

						// Loading is complete
						this.setState({
							loading: false
						});
						this.props.history.push("/profile?updateprofile=success");
					});
				}
			});
		}
	}

	render() {
		const { firstName, lastName, emailAddress, loading, validationErrors, serverError } = this.state;
		const { updateProfileStatus } = this.props;

		const successMessage = updateProfileStatus === REDUX_STATE.FULFILLED && !serverError && !validationErrors;

		return (
			<div>
				{successMessage && <ServerSuccess path={{ updateprofile: "success" }} message={t("success.updatePersonalProfile")} />}
				<ServerError error={serverError} />
				<div className="form-row">
					<div className="col">
						<InputField
							label={t("label.firstName")}
							name={"firstName"}
							id={"firstName-input"}
							value={firstName}
							type={"textField"}
							required
							ariaLabel={"firstName"}
							onChange={this.changeField}
							disabled={loading}
							error={validationErrors}
						/>
					</div>
					<div className="col">
						<InputField
							label={t("label.lastName")}
							name={"lastName"}
							id={"lastName-input"}
							value={lastName}
							type={"textField"}
							required
							ariaLabel={"lastName"}
							onChange={this.changeField}
							disabled={loading}
							error={validationErrors}
						/>
					</div>
				</div>
				<InputField
					label={t("label.emailAddress")}
					name={"emailAddress"}
					id={"email-input"}
					value={emailAddress}
					type={"textField"}
					required
					ariaLabel={"emailAddress"}
					onChange={this.changeField}
					disabled={loading}
					error={validationErrors}
				/>
				<button type="submit" className={"btn btn-primary btn-sm btn-block mt-4 p-3"} onClick={this.updateProfile} disabled={loading}>
					{t("components.profile.updateProfile")}
				</button>
			</div>
		);
	}
}

EditProfile.propTypes = {
	history: PropTypes.object,
	user: PropTypes.object,
	loadUser: PropTypes.func,
	updateProfile: PropTypes.func,
	updateProfileStatus: PropTypes.string
};

function mapStateToProps(state) {
	return {
		updateProfileStatus: state.getIn([PROFILE, "updateProfile", "status"])
	};
}

function mapDispatchToProps(dispatch) {
	return {
		loadUser: bindActionCreators(loadUser, dispatch),
		updateProfile: bindActionCreators(updateProfile, dispatch)
	};
}

export default User(
	withRouter(
		connect(
			mapStateToProps,
			mapDispatchToProps
		)(EditProfile)
	)
);
