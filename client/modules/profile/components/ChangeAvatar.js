import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import PropTypes from "prop-types";

import { t } from "shared/translations/i18n";

import Alert from "common/components/Alert";
import FileUploader from "common/components/inputs/FileUploader";

class ChangeAvatar extends Component {
	render() {
		const { history } = this.props;

		return (
			<Alert title={t("components.profile.changeProfilePhoto")} closeModal={() => history.push("/profile")}>
				<FileUploader acceptedFormats={["image/jpg", "image/jpeg", "image/png"]} multiple={false} imagePreview={true} maximumFileSize={"1mb"} />
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
