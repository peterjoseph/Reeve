import React, { Component } from "react";
import PropTypes from "prop-types";
import { ChromePicker } from "react-color";
import { variableExists } from "shared/utilities/filters";

class ColorPicker extends Component {
	state = {
		displayColorPicker: false
	};

	handleClick = () => {
		if (this.props.disabled) return;
		this.setState({ displayColorPicker: !this.state.displayColorPicker });
	};

	handleClose = () => {
		this.setState({ displayColorPicker: false });
	};

	handleChange = color => {
		if (this.props.disabled) return;

		// Separate onChange variables for when input field is used
		if (color.target && variableExists(color.target.value)) {
			this.props.onChange({ name: this.props.name, color: color.target.value || "" });
			return;
		}

		this.props.onChange({ name: this.props.name, color: color.hex || "" });
	};

	render() {
		const { id, name, value, label, required, smallText, disabled, error } = this.props;

		return (
			<div className="form-group">
				{label && (
					<label htmlFor={id}>
						{label} {required && "*"}
					</label>
				)}
				<div className="input-group">
					<div className="color-picker">
						<div className="row mx-0">
							<div className="color-window" style={{ cursor: disabled ? "not-allowed" : "pointer" }} onClick={this.handleClick}>
								<div className="color" style={{ background: value }} />
							</div>
							<div className="input-group-append">
								<input className={"form-control text-uppercase rounded-0"} name={name} maxLength="7" disabled={disabled} value={value} onChange={this.handleChange} />
							</div>
						</div>
						{this.state.displayColorPicker ? (
							<div className="type-selector mt-1">
								<div className="background-cover" onClick={this.handleClose} />
								<ChromePicker name={name} color={value} onChange={this.handleChange} disableAlpha={true} disabled={disabled} />
							</div>
						) : null}
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

ColorPicker.propTypes = {
	id: PropTypes.string,
	name: PropTypes.string,
	value: PropTypes.string,
	label: PropTypes.string,
	onChange: PropTypes.func,
	required: PropTypes.bool,
	smallText: PropTypes.string,
	disabled: PropTypes.bool,
	error: PropTypes.object
};

export default ColorPicker;
