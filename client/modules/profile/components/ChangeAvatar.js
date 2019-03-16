import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import PropTypes from "prop-types";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";

import { REDUX_STATE } from "shared/constants";
import { t } from "shared/translations/i18n";
import { MAX_FILE_UPLOAD_SIZE } from "shared/constants";
import { variableExists } from "shared/utilities/filters";

import { LOAD_USER_REJECTED, loadUser } from "common/store/reducers/authentication";
import { PROFILE, DELETE_PROFILE_PHOTO_REJECTED, deleteExistingProfilePhoto, SAVE_PROFILE_PHOTO_REJECTED, saveProfilePhoto } from "common/store/reducers/profile.js";

import User from "common/components/User";
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
		this.deleteExistingProfilePhoto = this.deleteExistingProfilePhoto.bind(this);
	}

	fileUploaded(files, errors) {
		this.setState({
			files: files,
			errors: errors
		});
	}

	saveImage() {}

	deleteExistingProfilePhoto() {}

	saveImageAvailable(files, errors) {
		!Array.isArray(files) || (Array.isArray(files) && files.length !== 1) || (Array.isArray(errors) && errors.length > 0);
	}

	closeModal() {
		if (!this.state.loading) {
			this.props.history.push("/profile");
		}
	}

	render() {
		const { user } = this.props;
		const { files, errors, loading } = this.state;

		// Check if save should be possible based on files being uploaded
		const saveDisabled = this.saveImageAvailable(files, errors);

		// Display button to remove profile photo if one already exists
		const showActionLink = !variableExists(user.get("profilePhoto"));

		return (
			<Modal
				title={t("components.profile.changeProfilePhoto")}
				actionButtonLabel={t("components.profile.saveImage")}
				actionButtonFunc={this.saveImage || loading}
				actionDisabled={saveDisabled}
				actionLinkLabel={t("components.profile.removeExistingProfilePhoto")}
				actionLinkFunc={this.deleteExistingProfilePhoto}
				actionLinkHidden={showActionLink}
				actionLinkDisabled={loading}
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
	user: PropTypes.object,
	loadUser: PropTypes.func,
	saveProfilePhoto: PropTypes.func,
	saveProfilePhotoStatus: PropTypes.string,
	deleteExistingProfilePhoto: PropTypes.func,
	deleteExistingProfilePhotoStatus: PropTypes.string,
	onClick: PropTypes.func,
	disabled: PropTypes.bool
};

function mapStateToProps(state) {
	return {
		saveProfilePhotoStatus: state.getIn([PROFILE, "saveProfilePhoto", "status"]),
		deleteExistingProfilePhotoStatus: state.getIn([PROFILE, "deleteProfilePhoto", "status"])
	};
}

function mapDispatchToProps(dispatch) {
	return {
		loadUser: bindActionCreators(loadUser, dispatch),
		saveProfilePhoto: bindActionCreators(saveProfilePhoto, dispatch),
		deleteExistingProfilePhoto: bindActionCreators(deleteExistingProfilePhoto, dispatch)
	};
}

export default User(
	withRouter(
		connect(
			mapStateToProps,
			mapDispatchToProps
		)(ChangeAvatar)
	)
);
