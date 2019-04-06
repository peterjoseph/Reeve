import React, { Component } from "react";
import PropTypes from "prop-types";

class ImageField extends Component {
	render() {
		const { id, name, activeImage, imagePreview, label, required, smallText, disabled, error } = this.props;

		const showPreview = imagePreview && imagePreview.files && imagePreview.files.length > 0 && imagePreview.files[0].src && imagePreview.files[0].src.base64;

		return (
			<div className="form-group">
				{label && (
					<label htmlFor={id}>
						{label} {required && "*"}
					</label>
				)}
				<div className="input-group">
					<div className="image-container border light rounded-0" style={{ cursor: disabled ? "not-allowed" : "pointer" }} onClick={() => !disabled && this.props.onClick(name)}>
						{showPreview ? <img src={imagePreview.files[0].src.base64} /> : <img src={activeImage || require("distribution/images/empty_image.svg")} />}
					</div>
					{error && error[name] && <div className="d-block invalid-feedback">{error[name][0]}</div>}
					{smallText && (
						<div className="w-100 text-muted">
							<small>{smallText}</small>
						</div>
					)}
				</div>
			</div>
		);
	}
}

ImageField.propTypes = {
	id: PropTypes.string,
	name: PropTypes.string,
	activeImage: PropTypes.string,
	imagePreview: PropTypes.object,
	label: PropTypes.string,
	onClick: PropTypes.func,
	required: PropTypes.bool,
	smallText: PropTypes.string,
	disabled: PropTypes.bool,
	error: PropTypes.object
};

export default ImageField;
