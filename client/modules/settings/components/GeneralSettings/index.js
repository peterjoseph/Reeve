import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { withRouter, Link } from "react-router-dom";
import moment from "moment";

import { REDUX_STATE, SUBSCRIPTION_TYPE, ROLE_TYPE } from "shared/constants";
import validate from "shared/validation/validate";
import { updateClient as updateClientValidation } from "shared/validation/settings";
import { t } from "shared/translations/i18n";
import { removeSimilarProperties } from "shared/utilities/filters";

import { SETTINGS, LOAD_CLIENT_REJECTED, UPDATE_CLIENT_REJECTED, loadClient, updateClient } from "common/store/reducers/settings.js";
import { LOAD_USER_REJECTED, loadUser } from "common/store/reducers/authentication";

import User from "common/components/User";
import HideComponent from "common/components/HideComponent";
import InputField from "common/components/inputs/InputField";
import TextArea from "common/components/inputs/TextArea";
import ServerSuccess from "common/components/ServerSuccess";
import ServerError from "common/components/ServerError";

class GeneralSettings extends Component {
	constructor(props) {
		super(props);

		this.state = {
			name: "",
			description: "",
			loading: true,
			validationErrors: null,
			serverError: null
		};

		this.setEditableFields = this.setEditableFields.bind(this);
		this.changeField = this.changeField.bind(this);
		this.updateAccessConfiguration = this.updateAccessConfiguration.bind(this);
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

		this.props.loadClient().then(result => {
			if (result.type === LOAD_CLIENT_REJECTED) {
				if (this._isMounted) {
					this.setState({
						serverError: result.payload
					});
				}
				return;
			} else {
				if (this._isMounted) {
					this.setEditableFields(result.payload.client);
				}
			}
		});
	}

	componentWillUnmount() {
		this._isMounted = false;
	}

	static getDerivedStateFromProps(nextProps, prevState) {
		if (nextProps.loadClientStatus === prevState.loadClientStatus) {
			return null;
		}
		// Store properties in state if valid
		if (nextProps.loadClientStatus === REDUX_STATE.FULFILLED) {
			return {
				loadClientStatus: REDUX_STATE.FULFILLED
			};
		}
		return null;
	}

	setEditableFields(field) {
		this.setState({
			name: field.name || "",
			description: field.description || "",
			loading: false
		});
	}

	changeField(evt) {
		this.setState({
			[evt.target.name]: evt.target.value
		});
	}

	updateAccessConfiguration(evt) {
		evt.preventDefault(); // Prevent page refresh

		if (this._isMounted) {
			this.setState({
				loading: true,
				validationErrors: null,
				serverError: null
			});
		}

		let body = {
			name: this.state.name,
			description: this.state.description
		};

		// Validate input parameters
		const valid = validate(body, updateClientValidation());
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
		const patchObject = removeSimilarProperties(body, this.props.client);

		// Validate input parameters with PATCH parameter
		const validPatch = validate(patchObject, updateClientValidation("patch"));
		if (validPatch != null) {
			if (this._isMounted) {
				this.setState({
					loading: false,
					validationErrors: valid
				});
			}
		} else {
			this.props.updateClient(patchObject).then(result => {
				if (result.type === UPDATE_CLIENT_REJECTED) {
					if (this._isMounted) {
						this.setState({
							loading: false,
							serverError: result.payload
						});
					}
				} else {
					this.props.loadClient().then(result => {
						if (result.type === LOAD_CLIENT_REJECTED) {
							if (this._isMounted) {
								this.setState({
									serverError: result.payload
								});
							}
							return;
						} else {
							if (this._isMounted) {
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
									this.props.history.push("/settings/general?updateaccessconfiguration=success");
								});
							}
						}
					});
				}
			});
		}
	}

	render() {
		const { client, user, loadClientStatus, updateClientStatus } = this.props;
		const { name, description, loading, validationErrors, serverError } = this.state;

		const disabled = loading || loadClientStatus == REDUX_STATE.PENDING || updateClientStatus == REDUX_STATE.PENDING;
		const successMessage = updateClientStatus === REDUX_STATE.FULFILLED && !serverError && !validationErrors;

		return (
			<div>
				<h1>{t("components.settings.general.generalSettings")}</h1>
				<div className="mt-3 mb-5">
					<h5>{t("components.settings.general.accountSummary")}</h5>
					<div className="card rounded-0 my-3 text-left">
						<div className="card-body">
							<div>
								<HideComponent user={user} disabled={!STRIPE_ENABLED && (user && user.get("subscriptionEndDate") == null)} hasAnyRole={[ROLE_TYPE.OWNER, ROLE_TYPE.FINANCE]}>
									<Fragment>
										<b>{t("components.settings.general.subscriptionType")}</b>{" "}
										<span className="text-uppercase text-muted">{client && t(`components.billing.subscriptionType.${client.get("subscriptionType")}`)}</span>{" "}
										{client && client.get("subscriptionType") == SUBSCRIPTION_TYPE.TRIAL && (
											<Link to={{ pathname: "/billing" }}>({t("components.settings.general.upgradePaidPlan")})</Link>
										)}
									</Fragment>
								</HideComponent>
							</div>
							<div>
								<b>{t("components.settings.general.workspaceCreationDate")}</b>{" "}
								<span className="text-muted">{client && moment(client.get("createdDate")).format("MMMM Do YYYY, h:mm A")}</span>
							</div>
							<div>
								<b>{t("components.settings.general.activeUsers")}</b> <span className="text-muted">{client && client.get("activeUsers")}</span>
							</div>
						</div>
					</div>
				</div>
				<div className="mt-3 mb-5">
					<h5>{t("components.settings.general.accessConfiguration")}</h5>
					<div className="card rounded-0 my-3 text-left">
						<div className="card-body">
							{successMessage && <ServerSuccess path={{ updateaccessconfiguration: "success" }} message={t("success.updateAccessConfiguration")} />}
							<ServerError error={serverError} />
							<InputField
								label={t("components.settings.general.workspaceTitle")}
								name={"name"}
								id={"name-input"}
								value={name}
								type={"textField"}
								ariaLabel={t("components.settings.general.workspaceTitle")}
								onChange={this.changeField}
								required
								disabled={disabled}
								error={validationErrors}
							/>
							<InputField
								label={t("components.settings.general.workspaceURL")}
								name={"workspaceurl"}
								id={"workspaceurl-input"}
								value={client ? `${BUILD_PROTOCOL}://${client.get("workspaceURL")}.${BUILD_DOMAINPATH}/`.toLowerCase() : ""}
								type={"textField"}
								ariaLabel={t("components.settings.general.workspaceURL")}
								smallText={t("components.settings.general.workspaceURLUniqueAddress")}
								disabled={true}
							/>
							<TextArea
								label={t("components.settings.general.workspaceDescription")}
								name={"description"}
								id={"description-input"}
								value={description}
								type={"textArea"}
								ariaLabel={t("components.settings.general.workspaceDescription")}
								rows={2}
								onChange={this.changeField}
								smallText={t("components.settings.general.workspaceDescriptionSubText")}
								disabled={disabled}
								error={validationErrors}
							/>
							<button type="submit" className={"btn btn-primary btn-sm btn-block mt-4 p-3"} onClick={this.updateAccessConfiguration} disabled={disabled}>
								{t("action.update")}
							</button>
						</div>
					</div>
				</div>
				<HideComponent user={user} hasAllRoles={[ROLE_TYPE.OWNER]}>
					<div className="mt-3 mb-5">
						<h5>{t("components.settings.general.dangerZone")}</h5>
						<div className="card rounded-0 my-3 text-left">
							<div className="card-body">
								<Fragment>
									<label className="text-danger">
										<b>{t("components.settings.general.deleteWorkspace")}</b>
									</label>
									<div className="text-danger">{t("components.settings.general.deleteWorkspaceWarning")}</div>
									<button
										type="submit"
										className={"btn btn-danger btn-sm mt-3 p-2"}
										onClick={() => this.props.history.push("/settings/general/delete-workspace")}
										disabled={disabled}
									>
										{t("components.settings.general.deleteWorkspace")}
									</button>
								</Fragment>
							</div>
						</div>
					</div>
				</HideComponent>
			</div>
		);
	}
}

GeneralSettings.propTypes = {
	history: PropTypes.object,
	client: PropTypes.object,
	user: PropTypes.object,
	loadUser: PropTypes.func,
	loadClient: PropTypes.func,
	loadClientStatus: PropTypes.string,
	updateClient: PropTypes.func,
	updateClientStatus: PropTypes.string
};

function mapStateToProps(state) {
	return {
		loadClientStatus: state.getIn([SETTINGS, "loadClient", "status"]),
		updateClientStatus: state.getIn([SETTINGS, "updateClient", "status"]),
		client: state.getIn([SETTINGS, "loadClient", "payload", "client"])
	};
}

function mapDispatchToProps(dispatch) {
	return {
		loadUser: bindActionCreators(loadUser, dispatch),
		loadClient: bindActionCreators(loadClient, dispatch),
		updateClient: bindActionCreators(updateClient, dispatch)
	};
}

export default User(
	withRouter(
		connect(
			mapStateToProps,
			mapDispatchToProps
		)(GeneralSettings)
	)
);
