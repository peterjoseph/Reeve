import React, { Component } from "react";
import PropTypes from "prop-types";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

import { REDUX_STATE } from "shared/constants";
import { t } from "shared/translations/i18n";
import validate from "shared/validation/validate";
import { updateClientStyling as updateClientStylingValidation } from "shared/validation/settings";
import { removeSimilarProperties } from "shared/utilities/filters";

import { SETTINGS, LOAD_CLIENT_STYLING_REJECTED, UPDATE_CLIENT_STYLING_REJECTED, loadClientStyling, updateClientStyling } from "common/store/reducers/settings.js";
import { LOAD_USER_REJECTED, loadUser } from "common/store/reducers/authentication";

import ColorPicker from "common/components/inputs/ColorPicker";
import ServerSuccess from "common/components/ServerSuccess";
import ServerError from "common/components/ServerError";

class Appearance extends Component {
	constructor(props) {
		super(props);

		this.state = {
			logoImage: "",
			backgroundImage: "",
			backgroundColor: "",
			primaryColor: "",
			secondaryColor: "",
			loading: false,
			validationErrors: null,
			serverError: null
		};

		this.selectColor = this.selectColor.bind(this);
		this.setEditableFields = this.setEditableFields.bind(this);
		this.saveClientStyling = this.saveClientStyling.bind(this);
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

		this.props.loadClientStyling().then(result => {
			if (result.type === LOAD_CLIENT_STYLING_REJECTED) {
				if (this._isMounted) {
					this.setState({
						serverError: result.payload
					});
				}
				return;
			} else {
				if (this._isMounted) {
					this.setEditableFields(result.payload.clientStyling);
				}
			}
		});
	}

	componentWillUnmount() {
		this._isMounted = false;
	}

	static getDerivedStateFromProps(nextProps, prevState) {
		if (nextProps.loadClientStylingStatus === prevState.loadClientStylingStatus) {
			return null;
		}
		// Store properties in state if valid
		if (nextProps.loadClientStylingStatus === REDUX_STATE.FULFILLED) {
			return {
				loadClientStylingStatus: REDUX_STATE.FULFILLED
			};
		}
		return null;
	}

	setEditableFields(field) {
		this.setState({
			logoImage: field.logoImage,
			backgroundImage: field.backgroundImage,
			backgroundColor: field.backgroundColor,
			primaryColor: field.primaryColor,
			secondaryColor: field.secondaryColor,
			loading: false
		});
	}

	selectColor(event) {
		this.setState({ [event.name]: event.color });
	}

	// PATCH Client Styling
	saveClientStyling(evt) {
		evt.preventDefault(); // Prevent page refresh

		if (this._isMounted) {
			this.setState({
				loading: true,
				validationErrors: null,
				serverError: null
			});
		}

		let body = {
			logoImage: this.state.logoImage,
			backgroundImage: this.state.backgroundImage,
			backgroundColor: this.state.backgroundColor,
			primaryColor: this.state.primaryColor,
			secondaryColor: this.state.secondaryColor
		};

		// Validate input parameters
		const valid = validate(body, updateClientStylingValidation());
		if (valid != null) {
			if (this._isMounted) {
				this.setState({
					loading: false,
					validationErrors: valid
				});
			}
			return;
		}

		// Strip body object of fields that have not changed and create new patch object
		const patchObject = removeSimilarProperties(body, this.props.clientStyling);

		// Validate input parameters with PATCH parameter
		const validPatch = validate(patchObject, updateClientStylingValidation("patch"));
		if (validPatch != null) {
			if (this._isMounted) {
				this.setState({
					loading: false,
					validationErrors: valid
				});
			}
		} else {
			this.props.updateClientStyling(patchObject).then(result => {
				if (result.type === UPDATE_CLIENT_STYLING_REJECTED) {
					if (this._isMounted) {
						this.setState({
							loading: false,
							serverError: result.payload
						});
					}
				} else {
					if (this._isMounted) {
						this.props.loadClientStyling().then(result => {
							if (result.type === LOAD_CLIENT_STYLING_REJECTED) {
								if (this._isMounted) {
									this.setState({
										serverError: result.payload
									});
								}
								return;
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
									this.props.history.push("/settings/appearance?updatestyling=success");
								});
							}
						});
					}
				}
			});
		}
	}

	render() {
		const { loadClientStylingStatus, updateClientStylingStatus } = this.props;
		const { backgroundColor, primaryColor, secondaryColor, loading, validationErrors, serverError } = this.state;

		const disabled = loading || loadClientStylingStatus == REDUX_STATE.PENDING || updateClientStylingStatus == REDUX_STATE.PENDING;
		const successMessage = updateClientStylingStatus === REDUX_STATE.FULFILLED && !serverError && !validationErrors;

		return (
			<div>
				<h1>{t("components.settings.appearance.appearanceAndBranding")}</h1>
				<div className="card rounded-0 my-3 text-left">
					<div className="card-body">
						{successMessage && <ServerSuccess path={{ updatestyling: "success" }} message={t("success.updateClientStyling")} />}
						<ServerError error={serverError} />
						<ColorPicker
							label={t("components.settings.appearance.backgroundColor")}
							name={"backgroundColor"}
							id={"background-color"}
							value={backgroundColor}
							onChange={this.selectColor}
							smallText={t("components.settings.appearance.backgroundColorDescription")}
							disabled={disabled}
							error={validationErrors}
						/>
						<ColorPicker
							label={t("components.settings.appearance.primaryColor")}
							name={"primaryColor"}
							id={"primary-color"}
							value={primaryColor}
							onChange={this.selectColor}
							smallText={t("components.settings.appearance.primaryColorDescription")}
							disabled={disabled}
							error={validationErrors}
						/>
						<ColorPicker
							label={t("components.settings.appearance.secondaryColor")}
							name={"secondaryColor"}
							id={"secondary-color"}
							value={secondaryColor}
							onChange={this.selectColor}
							smallText={t("components.settings.appearance.secondaryColorDescription")}
							disabled={disabled}
							error={validationErrors}
						/>
						<button type="submit" className={"btn btn-primary btn-sm btn-block mt-4 p-3"} onClick={this.saveClientStyling} disabled={disabled}>
							{t("action.update")}
						</button>
					</div>
				</div>
			</div>
		);
	}
}

Appearance.propTypes = {
	history: PropTypes.object,
	clientStyling: PropTypes.object,
	loadUser: PropTypes.func,
	loadClientStyling: PropTypes.func,
	loadClientStylingStatus: PropTypes.string,
	updateClientStyling: PropTypes.func,
	updateClientStylingStatus: PropTypes.string
};

function mapStateToProps(state) {
	return {
		loadClientStylingStatus: state.getIn([SETTINGS, "loadClientStyling", "status"]),
		updateClientStylingStatus: state.getIn([SETTINGS, "updateClientStyling", "status"]),
		clientStyling: state.getIn([SETTINGS, "loadClientStyling", "payload", "clientStyling"])
	};
}

function mapDispatchToProps(dispatch) {
	return {
		loadUser: bindActionCreators(loadUser, dispatch),
		loadClientStyling: bindActionCreators(loadClientStyling, dispatch),
		updateClientStyling: bindActionCreators(updateClientStyling, dispatch)
	};
}

export default withRouter(
	connect(
		mapStateToProps,
		mapDispatchToProps
	)(Appearance)
);
