import React, { Component, Fragment } from "react";
import { Link, withRouter } from "react-router-dom";
import PropTypes from "prop-types";
import Alert from "common/components/Alert";

import { t } from "shared/translations/i18n";

class ChangeAvatar extends Component {
	render() {
		const { history } = this.props;

		return (
			<Alert title={t("components.profile.changeProfilePhoto")} closeModal={() => history.push("/profile")}>
				<Fragment>
					<p>Modal contents</p>
				</Fragment>
			</Alert>
		);
	}
}

ChangeAvatar.propTypes = {
	history: PropTypes.object,
	onClick: PropTypes.func,
	disabled: PropTypes.bool
};

export default withRouter(ChangeAvatar);
