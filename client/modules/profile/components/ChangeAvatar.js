import React, { Component, Fragment } from "react";
import { withRouter } from "react-router-dom";
import PropTypes from "prop-types";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";

import { t } from "shared/translations/i18n";
import { MAX_FILE_UPLOAD_SIZE } from "shared/constants";
import { variableExists } from "shared/utilities/filters";

import { LOAD_USER_REJECTED, loadUser } from "common/store/reducers/authentication";
import { generateSignedURL, uploadToSignedURL, saveProfilePhoto, SAVE_PROFILE_PHOTO_REJECTED, DELETE_PROFILE_PHOTO_REJECTED, deleteExistingProfilePhoto } from "common/store/reducers/profile.js";

import User from "common/components/User";
import Modal from "common/components/Modal";
import FileUploader from "common/components/inputs/FileUploader";
import ServerError from "common/components/ServerError";

class ChangeAvatar extends Component {
	constructor(props) {
		super(props);

		this.state = {
			files: null,
			errors: null,
			loading: false,
			deleting: false
		};

		this.fileUploaded = this.fileUploaded.bind(this);
		this.saveImage = this.saveImage.bind(this);
		this.closeModal = this.closeModal.bind(this);
		this.deleteProfilePhoto = this.deleteProfilePhoto.bind(this);
	}

	// Set state when file uploaded
	fileUploaded(files, errors) {
		this.setState({
			files: files,
			errors: errors,
			serverError: null
		});
	}

	// Determine if save possible based on files uploaded and errors returned
	isSaveImagePossible(files, errors) {
		return !(!Array.isArray(files) || (Array.isArray(files) && files.length !== 1) || (Array.isArray(errors) && errors.length > 0));
	}

	// Create a pre-signed url and upload image to url
	saveImage(evt) {
		evt.preventDefault(); // Prevent page refresh

		this.setState({
			loading: true,
			serverError: null
		});

		// Validate files and errors
		const body = {
			files: this.state.files,
			errors: this.state.errors
		};
		const valid = this.isSaveImagePossible(body.files, body.errors);
		if (valid == false) {
			this.setState({
				loading: false
			});
		}

		// Get single file from files object and check object type
		const file = body.files[0].src.file;

		if (!(file instanceof File)) {
			this.setState({
				loading: false
			});
		}

		this.props.generateSignedURL({ contentType: file.type }).then(result => {
			if (result.type === SAVE_PROFILE_PHOTO_REJECTED) {
				this.setState({
					loading: false,
					serverError: result.payload
				});
			} else {
				// Store a copy of the key name to be stored in the bucket
				const key = result.key;

				// PUT request to upload image file to signed URL
				this.props.uploadToSignedURL({ signedURL: decodeURI(result.signedURL), contentType: file.type, data: file }).then(result => {
					if (result.type === SAVE_PROFILE_PHOTO_REJECTED) {
						this.setState({
							loading: false,
							serverError: result
						});
					} else {
						// Send key to our server and validate the image has been uploaded to S3
						this.props.saveProfilePhoto({ key: key }).then(result => {
							if (result.type === SAVE_PROFILE_PHOTO_REJECTED) {
								this.setState({
									loading: false,
									serverError: result
								});
							} else {
								// Reload the user
								this.props.loadUser().then(loadUserResult => {
									if (loadUserResult.type === LOAD_USER_REJECTED) {
										// Reload the web browser as loading the user failed
										window.location.reload;
										return;
									}
									this.setState({
										loading: false
									});
									// Close the modal
									this.closeModal();
								});
							}
						});
					}
				});
			}
		});
	}

	// Delete an existing profile photo
	deleteProfilePhoto(evt) {
		evt.preventDefault(); // Prevent page refresh

		this.setState({
			loading: true,
			deleting: true
		});

		this.props.deleteExistingProfilePhoto().then(result => {
			if (result.type === DELETE_PROFILE_PHOTO_REJECTED) {
				this.setState({
					loading: false,
					deleting: false,
					serverError: result
				});
			} else {
				this.props.loadUser().then(loadUserResult => {
					if (loadUserResult.type === LOAD_USER_REJECTED) {
						// Reload the web browser as loading the user failed
						window.location.reload;
						return;
					}

					this.setState({
						loading: false,
						deleting: false
					});

					// Close the modal
					this.closeModal();
				});
			}
		});
	}

	// Close modal window
	closeModal() {
		if (!this.state.loading) {
			this.props.history.push("/profile");
		}
	}

	render() {
		const { user } = this.props;
		const { files, errors, loading, deleting, serverError } = this.state;

		// Check if save should be possible based on files being uploaded
		const saveDisabled = !this.isSaveImagePossible(files, errors);

		// Display button to remove profile photo if one already exists
		const showActionLink = !variableExists(user.get("profilePhoto"));

		return (
			<Modal
				title={t("components.profile.changeProfilePhoto")}
				actionButtonLabel={loading && !deleting ? t("label.saving") : t("components.profile.saveImage")}
				actionButtonFunc={this.saveImage}
				actionDisabled={saveDisabled || loading}
				actionLinkLabel={deleting ? t("label.deleting") : t("components.profile.removeExistingProfilePhoto")}
				actionLinkFunc={this.deleteProfilePhoto}
				actionLinkHidden={showActionLink}
				actionLinkDisabled={loading}
				closeModal={this.closeModal}
				closeModalDisabled={loading}
			>
				<Fragment>
					<ServerError error={serverError} />
					<FileUploader
						acceptedFormats={["image/jpg", "image/jpeg", "image/png"]}
						multiple={false}
						imagePreview={true}
						fileUploadChange={this.fileUploaded}
						maximumFileSize={MAX_FILE_UPLOAD_SIZE.CHANGE_AVATAR}
						disabled={loading}
					/>
				</Fragment>
			</Modal>
		);
	}
}

ChangeAvatar.propTypes = {
	history: PropTypes.object,
	user: PropTypes.object,
	loadUser: PropTypes.func,
	generateSignedURL: PropTypes.func,
	uploadToSignedURL: PropTypes.func,
	saveProfilePhoto: PropTypes.func,
	deleteExistingProfilePhoto: PropTypes.func,
	onClick: PropTypes.func,
	disabled: PropTypes.bool
};

function mapDispatchToProps(dispatch) {
	return {
		loadUser: bindActionCreators(loadUser, dispatch),
		generateSignedURL: bindActionCreators(generateSignedURL, dispatch),
		uploadToSignedURL: bindActionCreators(uploadToSignedURL, dispatch),
		saveProfilePhoto: bindActionCreators(saveProfilePhoto, dispatch),
		deleteExistingProfilePhoto: bindActionCreators(deleteExistingProfilePhoto, dispatch)
	};
}

export default User(
	withRouter(
		connect(
			null,
			mapDispatchToProps
		)(ChangeAvatar)
	)
);
