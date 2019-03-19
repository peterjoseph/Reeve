import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";
import Files from "react-butterfiles";

import { t } from "shared/translations/i18n";

import Upload from "common/media/icons/Upload";

class FileUploader extends Component {
	constructor(props) {
		super(props);

		this.state = {
			files: null,
			errors: null
		};

		this.fileUploadSuccess = this.fileUploadSuccess.bind(this);
		this.fileUploadError = this.fileUploadError.bind(this);
		this.removeFile = this.removeFile.bind(this);
		this.removeError = this.removeError.bind(this);
		this.showErrorMessage = this.showErrorMessage.bind(this);
	}

	fileUploadSuccess(files) {
		if (!this.props.disabled) {
			this.setState({ files });
		}
		this.props.fileUploadChange && this.props.fileUploadChange(files, this.state.errors);
	}

	fileUploadError(errors) {
		if (!this.props.disabled) {
			this.setState({ errors });
		}
		this.props.fileUploadChange && this.props.fileUploadChange(this.state.files, errors);
	}

	removeFile(evt) {
		evt.preventDefault(); // Prevent page refresh

		if (this.props.disabled) {
			return;
		}

		const files = this.state.files.filter(function(file) {
			return file.id !== evt.target.value;
		});

		this.setState({ files });

		this.props.fileUploadChange && this.props.fileUploadChange(files, this.state.errors);
	}

	removeError(evt) {
		evt.preventDefault(); // Prevent page refresh

		if (this.props.disabled) {
			return;
		}

		const errors = this.state.errors.filter(function(error) {
			return error.id !== evt.target.value;
		});

		this.setState({ errors });

		this.props.fileUploadChange && this.props.fileUploadChange(this.state.files, errors);
	}

	showErrorMessage(errorType) {
		let message = null;
		switch (errorType) {
			case "unsupportedFileType":
				message = t("inputs.fileUploader.unsupportedFileType");
				break;
			case "maxSizeExceeded":
				message = t("inputs.fileUploader.maxSizeExceeded", { maxFileSize: this.props.maximumFileSize });
				break;
			case "multipleMaxCountExceeded":
				message = t("inputs.fileUploader.multipleMaxCountExceeded", { maximumFiles: this.props.multipleMaximumCount });
				break;
			case "multipleMaxSizeExceeded":
				message = t("inputs.fileUploader.multipleMaxSizeExceeded", { maxFileSize: this.props.multipleMaximumFileSize });
				break;
			case "multipleNotAllowed":
				message = t("inputs.fileUploader.multipleNotAllowed", { count: 1 });
				break;
			default:
				message = t("label.error");
		}
		return message;
	}

	render() {
		const { acceptedFormats, multiple, imagePreview, maximumFileSize, multipleMaximumFileSize, multipleMaximumCount, disabled } = this.props;
		const { files, errors } = this.state;

		// Show image preview on file load?
		const showPreview = imagePreview && files && files.length > 0 && files[0].src && files[0].src.base64;

		return (
			<Files
				multiple={multiple}
				maxSize={maximumFileSize}
				convertToBase64={imagePreview}
				multipleMaxSize={multipleMaximumFileSize}
				multipleMaxCount={multipleMaximumCount}
				accept={acceptedFormats}
				onSuccess={this.fileUploadSuccess}
				onError={this.fileUploadError}
			>
				{({ browseFiles, getDropZoneProps }) => (
					<div id="file-input">
						<div className="drop-zone" {...getDropZoneProps()}>
							<div className="drop-window d-flex p-2 bg-light border light">
								<div className="no-files w-100 text-center">
									{showPreview && (
										<div className="w-100 text-center">
											<img src={files[0].src.base64} className="img-fluid img-thumbnail mb-3" style={{ maxHeight: "30vh" }} />
										</div>
									)}
									{!showPreview && (
										<Fragment>
											<Upload className="text-primary my-2" width="1.5em" height="1.5em" />
											<div className="my-2">
												{multiple
													? imagePreview
														? t("inputs.fileUploader.dragDropImage_plural")
														: t("inputs.fileUploader.dragDropFile_plural")
													: imagePreview
													? t("inputs.fileUploader.dragDropImage")
													: t("inputs.fileUploader.dragDropFile")}
											</div>
										</Fragment>
									)}
									<button className="btn btn-outline-primary btn-sm my-2" onClick={browseFiles} disabled={disabled}>
										{t("label.browse")}
									</button>
								</div>
							</div>
							<div className="file-list">
								{files &&
									files.map(file => (
										<div key={file.name} className="file alert border light rounded-0 my-2 p-2">
											{file.name}
											<button type="button" className="close" value={file.id} onClick={this.removeFile} data-dismiss="alert" aria-label={t("action.close")}>
												&times;
											</button>
										</div>
									))}
								{errors &&
									errors.map(error => (
										<div key={error.id} className="error alert border-danger rounded-0 my-2 p-2">
											<button type="button" className="close" value={error.id} onClick={this.removeError} data-dismiss="alert" aria-label={t("action.close")}>
												&times;
											</button>
											{error.file && error.file.name}
											{error.file && <br />}
											{this.showErrorMessage(error.type)}
										</div>
									))}
							</div>
						</div>
					</div>
				)}
			</Files>
		);
	}
}

FileUploader.propTypes = {
	acceptedFormats: PropTypes.array.isRequired,
	multiple: PropTypes.bool.isRequired,
	imagePreview: PropTypes.bool,
	maximumFileSize: PropTypes.string,
	multipleMaximumFileSize: PropTypes.string,
	multipleMaximumCount: PropTypes.number,
	fileUploadChange: PropTypes.func,
	disabled: PropTypes.bool
};

export default FileUploader;
