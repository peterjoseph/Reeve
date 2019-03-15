import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import PropTypes from "prop-types";

import { t } from "shared/translations/i18n";
import { MAX_FILE_UPLOAD_SIZE } from "shared/constants";

import Modal from "common/components/Modal";
import FileUploader from "common/components/inputs/FileUploader";

class ChangeAvatar extends Component {
	constructor(props) {
		super(props);

		this.state = {
			files: null,
			errors: null,
			loading: false
		};

		this.fileUploaded = this.fileUploaded.bind(this);
		this.saveImage = this.saveImage.bind(this);
		this.closeModal = this.closeModal.bind(this);
	}

	fileUploaded(files, errors) {
		this.setState({
			files: files,
			errors: errors
		});
	}

	saveImage() {}

	closeModal() {
		if (!this.state.loading) {
			this.props.history.push("/profile");
		}
	}

	render() {
		const { files, errors, loading } = this.state;

		// Check if save should be possible based on files being uploaded
		const saveDisabled = !Array.isArray(files) || (Array.isArray(files) && files.length !== 1) || (Array.isArray(errors) && errors.length > 0);

		return (
			<Modal
				title={t("components.profile.changeProfilePhoto")}
				actionButtonLabel={t("components.profile.saveImage")}
				actionButtonFunc={this.saveImage}
				actionDisabled={saveDisabled}
				closeModal={this.closeModal}
			>
				<FileUploader
					acceptedFormats={["image/jpg", "image/jpeg", "image/png"]}
					multiple={false}
					imagePreview={true}
					fileUploadChange={this.fileUploaded}
					maximumFileSize={MAX_FILE_UPLOAD_SIZE.CHANGE_AVATAR}
					disabled={loading}
				/>
			</Modal>
		);
	}
}

ChangeAvatar.propTypes = {
	history: PropTypes.object,
	onClick: PropTypes.func,
	disabled: PropTypes.bool
};

export default withRouter(ChangeAvatar);
