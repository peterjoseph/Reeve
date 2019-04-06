import React, { Component, Fragment } from "react";
import { withRouter } from "react-router-dom";
import PropTypes from "prop-types";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";

import { t } from "shared/translations/i18n";
import fetch from "common/fetch";
import validate from "shared/validation/validate";
import { clearToken } from "shared/utilities/securityToken";
import { deleteWorkspace as deleteWorkspaceValidation } from "shared/validation/settings";

import { LOGOUT_REJECTED, logoutUser } from "common/store/reducers/authentication";
import { deleteWorkspace, DELETE_WORKSPACE_REJECTED } from "common/store/reducers/settings.js";

import Modal from "common/components/Modal";
import InputField from "common/components/inputs/InputField";
import ServerError from "common/components/ServerError";

class DeleteWorkspace extends Component {
	constructor(props) {
		super(props);

		this.state = {
			workspaceURL: "",
			accountPassword: "",
			loading: false,
			validationErrors: null,
			serverError: null
		};

		this.closeModal = this.closeModal.bind(this);
		this.changeField = this.changeField.bind(this);
		this.deleteWorkspace = this.deleteWorkspace.bind(this);
		this.logout = this.logout.bind(this);
	}

	changeField(evt) {
		this.setState({
			[evt.target.name]: evt.target.value
		});
	}

	// Delete Workspace
	deleteWorkspace(evt) {
		evt.preventDefault(); // Prevent page refresh

		this.setState({
			loading: true,
			validationErrors: null,
			serverError: null
		});

		let body = {
			workspaceURL: this.state.workspaceURL,
			accountPassword: this.state.accountPassword
		};

		// Validate input parameters
		const valid = validate(body, deleteWorkspaceValidation());
		if (valid != null) {
			this.setState({
				loading: false,
				validationErrors: valid
			});
			return;
		} else {
			this.props.deleteWorkspace(body).then(result => {
				if (result.type === DELETE_WORKSPACE_REJECTED) {
					this.setState({
						loading: false,
						serverError: result.payload
					});
				} else {
					// Loading is complete
					this.setState({
						loading: false
					});
					this.logout();
				}
			});
		}
	}

	logout() {
		// Remove user session from store
		this.props.logoutUser().then(result => {
			if (result.type === LOGOUT_REJECTED) {
				// Reload page
				window.location.reload;
			} else {
				clearToken(); // Clear security token in browser
				fetch.clearSecurityToken(); // Clear token in fetch header

				// Refresh Browser Window
				const url = `${BUILD_PROTOCOL}://${BUILD_DOMAINPATH}/signin`;
				window.location.replace(url);
			}
		});
	}

	// Close modal window
	closeModal() {
		if (!this.state.loading) {
			this.props.history.push("/settings/general");
		}
	}

	render() {
		const { workspaceURL, accountPassword, loading, validationErrors, serverError } = this.state;

		return (
			<Modal
				title={t("components.settings.general.deleteWorkspace")}
				actionButtonLabel={t("components.settings.general.deleteWorkspace")}
				actionButtonFunc={this.deleteWorkspace}
				actionDangerous={true}
				actionDisabled={loading}
				closeModal={this.closeModal}
				closeModalDisabled={loading}
			>
				<Fragment>
					<ServerError error={serverError} />
					<div className="mb-2">{t("components.settings.general.deleteWorkspaceModal.warning")}</div>
					<div>{t("components.settings.general.deleteWorkspaceModal.procedure")}</div>
					<div className="mt-4">
						<InputField
							label={t("label.workspaceName")}
							name={"workspaceURL"}
							id={"workspaceURL"}
							value={workspaceURL}
							type={"textField"}
							ariaLabel={t("label.workspaceName")}
							onChange={this.changeField}
							disabled={loading}
							error={validationErrors}
						/>
						<InputField
							label={t("label.password")}
							name={"accountPassword"}
							id={"accountPassword"}
							value={accountPassword}
							type={"password"}
							ariaLabel={t("label.password")}
							onChange={this.changeField}
							disabled={loading}
							error={validationErrors}
						/>
					</div>
				</Fragment>
			</Modal>
		);
	}
}

DeleteWorkspace.propTypes = {
	history: PropTypes.object,
	deleteWorkspace: PropTypes.func,
	logoutUser: PropTypes.func
};

function mapDispatchToProps(dispatch) {
	return {
		deleteWorkspace: bindActionCreators(deleteWorkspace, dispatch),
		logoutUser: bindActionCreators(logoutUser, dispatch)
	};
}

export default withRouter(
	connect(
		null,
		mapDispatchToProps
	)(DeleteWorkspace)
);
