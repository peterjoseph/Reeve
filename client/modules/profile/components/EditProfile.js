import React, { Component } from "react";
import PropTypes from "prop-types";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

import { REDUX_STATE } from "shared/constants";
import validate from "shared/validation/validate";
import { t } from "shared/translations/i18n";
import { updateUserProfile } from "shared/validation/profile";
import { removeSimilarProperties } from "shared/utilities/filters";

import { PROFILE, UPDATE_PROFILE_REJECTED, LOAD_PROFILE_REJECTED, loadProfile, updateProfile } from "common/store/reducers/profile.js";
import { LOAD_USER_REJECTED, loadUser } from "common/store/reducers/authentication";

import User from "common/components/User";
import InputField from "common/components/inputs/InputField";
import TextArea from "common/components/inputs/TextArea";
import ServerSuccess from "common/components/ServerSuccess";
import ServerError from "common/components/ServerError";

class EditProfile extends Component {
	constructor(props) {
		super(props);

		this.state = {
			firstName: "",
			lastName: "",
			emailAddress: "",
			bio: "",
			location: "",
			website: "",
			loading: false,
			validationErrors: null,
			serverError: null
		};

		this.updateProfile = this.updateProfile.bind(this);
		this.setEditableFields = this.setEditableFields.bind(this);
		this.changeField = this.changeField.bind(this);
	}

	componentDidMount() {
		this._isMounted = true;

		if (this._isMounted) {
			this.setState({
				loading: true,
				validationErrors: null,
				serverError: null
			});
		}

		this.props.loadProfile().then(result => {
			if (result.type === LOAD_PROFILE_REJECTED) {
				if (this._isMounted) {
					this.setState({
						serverError: result.payload
					});
				}
				return;
			} else {
				if (this._isMounted) {
					this.setEditableFields(result.payload.user);
				}
			}
		});
	}

	componentWillUnmount() {
		this._isMounted = false;
	}

	static getDerivedStateFromProps(nextProps, prevState) {
		if (nextProps.loadProfileStatus === prevState.loadProfileStatus) {
			return null;
		}
		// Store properties in state if valid
		if (nextProps.loadProfileStatus === REDUX_STATE.FULFILLED) {
			return {
				loadProfileStatus: REDUX_STATE.FULFILLED
			};
		}
		return null;
	}

	setEditableFields(field) {
		this.setState({
			firstName: field.firstName,
			lastName: field.lastName,
			emailAddress: field.emailAddress,
			bio: field.bio || "",
			location: field.location || "",
			website: field.website || "",
			loading: false
		});
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
			emailAddress: this.state.emailAddress,
			bio: this.state.bio,
			location: this.state.location,
			website: this.state.website
		};

		// Validate input parameters
		const valid = validate(body, updateUserProfile());
		if (valid != null) {
			this.setState({
				loading: false,
				validationErrors: valid
			});
			return;
		}

		// Strip body object of fields that have not changed and create new patch object
		const patchObject = removeSimilarProperties(body, this.props.userProfile);

		// Validate input parameters with PATCH parameter
		const validPatch = validate(patchObject, updateUserProfile("patch"));
		if (validPatch != null) {
			this.setState({
				loading: false,
				validationErrors: valid
			});
		} else {
			this.props.updateProfile(patchObject).then(result => {
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
							emailAddress: this.props.user.get("emailAddress"),
							loading: false
						});
						this.props.history.push("/profile?updateprofile=success");
					});
				}
			});
		}
	}

	render() {
		const { firstName, lastName, emailAddress, bio, location, website, loading, validationErrors, serverError } = this.state;
		const { loadProfileStatus, updateProfileStatus, user } = this.props;

		const successMessage = updateProfileStatus === REDUX_STATE.FULFILLED && !serverError && !validationErrors;
		const emailWarning = loadProfileStatus === REDUX_STATE.FULFILLED && user.get("emailAddress") !== emailAddress;

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
				{emailWarning && <div className="alert alert-warning rounded-0">{t("components.profile.changeEmailWarning")}</div>}
				<TextArea
					label={t("label.aboutMe")}
					name={"bio"}
					id={"bio-input"}
					value={bio}
					type={"textField"}
					ariaLabel={"bio"}
					rows={2}
					onChange={this.changeField}
					disabled={loading}
					error={validationErrors}
				/>
				<div className="form-row">
					<div className="col">
						<InputField
							label={t("label.location")}
							name={"location"}
							id={"location-input"}
							value={location}
							type={"textField"}
							ariaLabel={"location"}
							onChange={this.changeField}
							disabled={loading}
							error={validationErrors}
						/>
					</div>
					<div className="col">
						<InputField
							label={t("label.website")}
							name={"website"}
							id={"website-input"}
							value={website}
							type={"textField"}
							ariaLabel={"website"}
							onChange={this.changeField}
							disabled={loading}
							error={validationErrors}
						/>
					</div>
				</div>
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
	userProfile: PropTypes.object,
	loadUser: PropTypes.func,
	loadProfile: PropTypes.func,
	loadProfileStatus: PropTypes.string,
	updateProfile: PropTypes.func,
	updateProfileStatus: PropTypes.string
};

function mapStateToProps(state) {
	return {
		userProfile: state.getIn([PROFILE, "loadProfile", "payload", "user"]),
		loadProfileStatus: state.getIn([PROFILE, "loadProfile", "status"]),
		updateProfileStatus: state.getIn([PROFILE, "updateProfile", "status"])
	};
}

function mapDispatchToProps(dispatch) {
	return {
		loadUser: bindActionCreators(loadUser, dispatch),
		loadProfile: bindActionCreators(loadProfile, dispatch),
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
