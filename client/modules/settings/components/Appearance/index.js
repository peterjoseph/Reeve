import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { withRouter, Link } from "react-router-dom";

import { REDUX_STATE, MAX_FILE_UPLOAD_SIZE } from "shared/constants";
import { t } from "shared/translations/i18n";
import validate from "shared/validation/validate";
import { updateClientStyling as updateClientStylingValidation } from "shared/validation/settings";
import { removeSimilarProperties } from "shared/utilities/filters";

import { LOAD_USER_REJECTED, loadUser } from "common/store/reducers/authentication";
import {
	loadClientStyling,
	updateClientStyling,
	generateSignedURL,
	uploadToSignedURL,
	SETTINGS,
	LOAD_CLIENT_STYLING_REJECTED,
	UPDATE_CLIENT_STYLING_REJECTED
} from "common/store/reducers/settings.js";

import ImageField from "./components/ImageField";
import ColorPicker from "common/components/inputs/ColorPicker";
import Modal from "common/components/Modal";
import FileUploader from "common/components/inputs/FileUploader";
import ServerSuccess from "common/components/ServerSuccess";
import ServerError from "common/components/ServerError";

class Appearance extends Component {
	constructor(props) {
		super(props);

		this.state = {
			loading: false,
			logoImageModal: false,
			backgroundImageModal: false,
			logoImage: "",
			logoImageURL: "",
			logoImageUpload: null,
			backgroundImage: "",
			backgroundImageURL: "",
			backgroundImageUpload: null,
			tempFileUpload: {},
			backgroundColor: "",
			primaryColor: "",
			secondaryColor: "",
			validationErrors: null,
			serverError: null
		};

		this.openModal = this.openModal.bind(this);
		this.closeModal = this.closeModal.bind(this);
		this.setEditableFields = this.setEditableFields.bind(this);
		this.selectColor = this.selectColor.bind(this);
		this.storeImage = this.storeImage.bind(this);
		this.fileUploaded = this.fileUploaded.bind(this);
		this.saveClientStyling = this.saveClientStyling.bind(this);
		this.deleteExistingPhoto = this.deleteExistingPhoto.bind(this);
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
			logoImageURL: field.logoImageURL,
			logoImageUpload: null,
			backgroundImage: field.backgroundImage,
			backgroundImageURL: field.backgroundImageURL,
			backgroundImageUpload: null,
			backgroundColor: field.backgroundColor,
			primaryColor: field.primaryColor,
			secondaryColor: field.secondaryColor,
			loading: false
		});
	}

	openModal(name) {
		if (this._isMounted) {
			if (name === "logoImage") {
				this.setState({ logoImageModal: true });
			} else if (name === "backgroundImage") {
				this.setState({ backgroundImageModal: true });
			}
		}
	}

	closeModal(evt) {
		evt.preventDefault(); // Prevent page refresh

		if (this._isMounted) {
			this.setState({
				logoImageModal: false,
				backgroundImageModal: false,
				tempFileUpload: {}
			});
		}
	}

	selectColor(event) {
		this.setState({ [event.name]: event.color });
	}

	storeImage(name) {
		// Move our temporary image upload to something more permanent
		if (this._isMounted) {
			const stateObject = {
				// Clear our temporary file object from state on complete
				logoImageModal: false,
				backgroundImageModal: false,
				tempFileUpload: {}
			};

			if (name === "logoImage") {
				stateObject.logoImageUpload = {
					...this.state.tempFileUpload
				};
			} else if (name === "backgroundImage") {
				stateObject.backgroundImageUpload = {
					...this.state.tempFileUpload
				};
			}
			this.setState(stateObject);
		}
	}

	fileUploaded(files, errors) {
		if (this._isMounted) {
			this.setState({
				tempFileUpload: {
					files: files,
					errors: errors
				}
			});
		}
	}

	deleteExistingPhoto(name) {
		if (this._isMounted) {
			const stateObject = {
				// Clear our temporary file object from state on complete
				logoImageModal: false,
				backgroundImageModal: false,
				tempFileUpload: {}
			};

			if (name === "logoImage") {
				stateObject.logoImage = "";
				stateObject.logoImageURL = "";
				stateObject.logoImageUpload = null;
			} else if (name === "backgroundImage") {
				stateObject.backgroundImage = "";
				stateObject.backgroundImageURL = "";
				stateObject.backgroundImageUpload = null;
			}
			this.setState(stateObject);
		}
	}

	// Determine if save possible based on files uploaded and errors returned
	isSaveImagePossible(files, errors) {
		return !(!Array.isArray(files) || (Array.isArray(files) && files.length !== 1) || (Array.isArray(errors) && errors.length > 0));
	}

	// PATCH Client Styling
	async saveClientStyling(evt) {
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

		// If custom logo image or background image has been uploaded, generate signed urls

		// Logo image signed url
		let logoImageSignedURL = null;
		if (this.state.logoImageUpload !== null) {
			const logoImageObject = {
				files: this.state.logoImageUpload.files,
				errors: this.state.logoImageUpload.errors
			};
			const valid = this.isSaveImagePossible(logoImageObject.files, logoImageObject.errors);
			if (valid == false) {
				this.setState({
					loading: false
				});
				return;
			}

			// Get single file from files object and check object type
			const file = logoImageObject.files[0].src.file;

			if (!(file instanceof File)) {
				this.setState({
					loading: false
				});
				return;
			}

			logoImageSignedURL = await this.props.generateSignedURL({ contentType: file.type });
			if (logoImageSignedURL.type === UPDATE_CLIENT_STYLING_REJECTED) {
				this.setState({
					loading: false,
					serverError: logoImageSignedURL.payload
				});
				return;
			} else {
				// Store a copy of the key name to be stored in the bucket
				const key = logoImageSignedURL.key;

				// PUT request to upload image file to signed URL
				const imageUpload = await this.props.uploadToSignedURL({ signedURL: decodeURI(logoImageSignedURL.signedURL), contentType: file.type, data: file });

				if (imageUpload.type === UPDATE_CLIENT_STYLING_REJECTED) {
					this.setState({
						loading: false,
						serverError: imageUpload
					});
				} else {
					body.logoImage = key;
				}
			}
		}

		// Background image signed url
		let backgroundImageSignedURL = null;
		if (this.state.backgroundImageUpload !== null) {
			const backgroundImageObject = {
				files: this.state.backgroundImageUpload.files,
				errors: this.state.backgroundImageUpload.errors
			};
			const valid = this.isSaveImagePossible(backgroundImageObject.files, backgroundImageObject.errors);
			if (valid == false) {
				this.setState({
					loading: false
				});
				return;
			}

			// Get single file from files object and check object type
			const file = backgroundImageObject.files[0].src.file;

			if (!(file instanceof File)) {
				this.setState({
					loading: false
				});
				return;
			}

			backgroundImageSignedURL = await this.props.generateSignedURL({ contentType: file.type });
			if (backgroundImageSignedURL.type === UPDATE_CLIENT_STYLING_REJECTED) {
				this.setState({
					loading: false,
					serverError: backgroundImageSignedURL.payload
				});
				return;
			} else {
				// Store a copy of the key name to be stored in the bucket
				const key = backgroundImageSignedURL.key;

				// PUT request to upload image file to signed URL
				const imageUpload = await this.props.uploadToSignedURL({ signedURL: decodeURI(backgroundImageSignedURL.signedURL), contentType: file.type, data: file });

				if (imageUpload.type === UPDATE_CLIENT_STYLING_REJECTED) {
					this.setState({
						loading: false,
						serverError: imageUpload
					});
				} else {
					body.backgroundImage = key;
				}
			}
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
		const {
			logoImageURL,
			backgroundImageURL,
			backgroundColor,
			primaryColor,
			secondaryColor,
			logoImageUpload,
			backgroundImageUpload,
			tempFileUpload,
			logoImageModal,
			backgroundImageModal,
			loading,
			validationErrors,
			serverError
		} = this.state;

		const disabled = loading || loadClientStylingStatus == REDUX_STATE.PENDING || updateClientStylingStatus == REDUX_STATE.PENDING;

		// Messy validation to confirm if a file can be uploaded
		const fileUploadDisabled =
			!tempFileUpload ||
			(!Array.isArray(tempFileUpload.files) ||
				(Array.isArray(tempFileUpload.files) && tempFileUpload.files.length !== 1) ||
				(Array.isArray(tempFileUpload.errors) && tempFileUpload.errors.length > 0));

		const successMessage = updateClientStylingStatus === REDUX_STATE.FULFILLED && !serverError && !validationErrors;

		return (
			<div>
				<h1>{t("components.settings.appearance.appearanceAndBranding")}</h1>
				<div className="card rounded-0 my-3 text-left">
					<div className="card-body">
						{successMessage && <ServerSuccess path={{ updatestyling: "success" }} message={t("success.updateClientStyling")} />}
						<ServerError error={serverError} />
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
						{logoImageModal && (
							<Modal
								title={t("components.settings.appearance.selectLogoImage")}
								actionButtonLabel={t("action.continue")}
								actionButtonFunc={() => this.storeImage("logoImage")}
								actionDisabled={fileUploadDisabled}
								actionLinkLabel={t("components.settings.appearance.deleteExistingImage")}
								actionLinkFunc={() => this.deleteExistingPhoto("logoImage")}
								actionLinkHidden={!((logoImageUpload && logoImageUpload.files) || logoImageURL !== "")}
								closeModal={this.closeModal}
							>
								<Fragment>
									<FileUploader
										acceptedFormats={["image/jpg", "image/jpeg", "image/png"]}
										multiple={false}
										imagePreview={true}
										fileUploadChange={this.fileUploaded}
										maximumFileSize={MAX_FILE_UPLOAD_SIZE.LOGO_IMAGE}
										disabled={false}
									/>
								</Fragment>
							</Modal>
						)}
						<ImageField
							label={t("components.settings.appearance.logoImage")}
							name={"logoImage"}
							id={"logo-image"}
							activeImage={logoImageURL}
							imagePreview={logoImageUpload}
							onClick={this.openModal}
							smallText={t("components.settings.appearance.logoImageDescription")}
							disabled={disabled}
							error={validationErrors}
						/>
						{backgroundImageModal && (
							<Modal
								title={t("components.settings.appearance.selectBackgroundImage")}
								actionButtonLabel={t("action.continue")}
								actionButtonFunc={() => this.storeImage("backgroundImage")}
								actionDisabled={fileUploadDisabled}
								actionLinkLabel={t("components.settings.appearance.deleteExistingImage")}
								actionLinkFunc={() => this.deleteExistingPhoto("backgroundImage")}
								actionLinkHidden={!((backgroundImageUpload && backgroundImageUpload.files) || backgroundImageURL !== "")}
								closeModal={this.closeModal}
							>
								<Fragment>
									<FileUploader
										acceptedFormats={["image/jpg", "image/jpeg", "image/png"]}
										multiple={false}
										imagePreview={true}
										fileUploadChange={this.fileUploaded}
										maximumFileSize={MAX_FILE_UPLOAD_SIZE.BACKGROUND_IMAGE}
										disabled={false}
									/>
								</Fragment>
							</Modal>
						)}
						<ImageField
							label={t("components.settings.appearance.backgroundImage")}
							name={"backgroundImage"}
							id={"background-image"}
							activeImage={backgroundImageURL}
							imagePreview={backgroundImageUpload}
							onClick={this.openModal}
							smallText={t("components.settings.appearance.backgroundImageDescription")}
							disabled={disabled}
							error={validationErrors}
						/>
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
						<button type="submit" className={"btn btn-primary btn-sm btn-block mt-4 p-3"} onClick={this.saveClientStyling} disabled={disabled}>
							{t("action.update")}
						</button>
					</div>
				</div>
				<div className="ml-4">
					<Link to={{ pathname: "/settings/appearance/confirm-reset" }}>
						<span>{t("components.settings.appearance.resetAppearance")}</span>
					</Link>
				</div>
			</div>
		);
	}
}

Appearance.propTypes = {
	history: PropTypes.object,
	clientStyling: PropTypes.object,
	loadUser: PropTypes.func,
	generateSignedURL: PropTypes.func,
	uploadToSignedURL: PropTypes.func,
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
		generateSignedURL: bindActionCreators(generateSignedURL, dispatch),
		uploadToSignedURL: bindActionCreators(uploadToSignedURL, dispatch),
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
