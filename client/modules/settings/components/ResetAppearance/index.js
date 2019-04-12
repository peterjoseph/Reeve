import React, { Component, Fragment } from "react";
import { withRouter } from "react-router-dom";
import PropTypes from "prop-types";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";

import { t } from "shared/translations/i18n";

import { resetClientStyling, RESET_CLIENT_STYLING_REJECTED } from "common/store/reducers/settings.js";
import { LOAD_USER_REJECTED, loadUser } from "common/store/reducers/authentication";

import Modal from "common/components/Modal";
import ServerError from "common/components/ServerError";

class ResetAppearance extends Component {
	constructor(props) {
		super(props);

		this.state = {
			loading: false,
			serverError: null
		};

		this.closeModal = this.closeModal.bind(this);
		this.resetAppearance = this.resetAppearance.bind(this);
	}

	// Reset workspace branding & appearance
	resetAppearance(evt) {
		evt.preventDefault(); // Prevent page refresh

		this.setState({
			loading: true,
			serverError: null
		});

		this.props.resetClientStyling().then(result => {
			if (result.type === RESET_CLIENT_STYLING_REJECTED) {
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
					this.closeModal();
				});
			}
		});
	}

	// Close modal window
	closeModal() {
		if (!this.state.loading) {
			this.props.history.push("/settings/appearance");
		}
	}

	render() {
		const { loading, serverError } = this.state;

		return (
			<Modal
				title={t("components.settings.appearance.resetAppearanceAlert.title")}
				actionButtonLabel={t("action.resetToDefault")}
				actionButtonFunc={this.resetAppearance}
				actionDangerous={true}
				actionDisabled={loading}
				closeModal={this.closeModal}
				closeModalDisabled={loading}
			>
				<Fragment>
					<ServerError error={serverError} />
					<div className="mb-2">{t("components.settings.appearance.resetAppearanceAlert.message")}</div>
				</Fragment>
			</Modal>
		);
	}
}

ResetAppearance.propTypes = {
	history: PropTypes.object,
	resetClientStyling: PropTypes.func,
	loadUser: PropTypes.func
};

function mapDispatchToProps(dispatch) {
	return {
		resetClientStyling: bindActionCreators(resetClientStyling, dispatch),
		loadUser: bindActionCreators(loadUser, dispatch)
	};
}

export default withRouter(
	connect(
		null,
		mapDispatchToProps
	)(ResetAppearance)
);
