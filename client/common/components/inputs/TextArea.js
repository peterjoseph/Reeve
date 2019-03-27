import React from "react";
import PropTypes from "prop-types";

class TextArea extends React.Component {
	render() {
		const { name, value, onChange, label, rows, id, ariaLabel, smallText, resize, placeholder, required, disabled, error } = this.props;

		return (
			<div className={"form-group"}>
				{label && (
					<label htmlFor={id}>
						{label} {required && "*"}
					</label>
				)}
				<div className="input-group">
					<textarea
						name={name}
						value={value}
						style={{ resize: resize ? "vertical" : "none" }}
						rows={rows}
						className={"form-control rounded-0"}
						id={id}
						aria-describedby={ariaLabel}
						onChange={onChange}
						placeholder={placeholder}
						disabled={disabled}
					/>
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

TextArea.propTypes = {
	name: PropTypes.string,
	value: PropTypes.string,
	onChange: PropTypes.func,
	label: PropTypes.string,
	id: PropTypes.string,
	ariaLabel: PropTypes.string,
	rows: PropTypes.number,
	resize: PropTypes.bool,
	placeholder: PropTypes.string,
	smallText: PropTypes.string,
	required: PropTypes.bool,
	disabled: PropTypes.bool,
	error: PropTypes.object
};

export default TextArea;
