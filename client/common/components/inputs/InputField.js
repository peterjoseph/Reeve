import React from "react";
import PropTypes from "prop-types";

class InputField extends React.Component {
	render() {
		const { name, value, onChange, label, id, type, ariaLabel, placeholder, required, disabled, error } = this.props;

		return (
			<div className="form-group">
				{label && (
					<label htmlFor={id}>
						{label} {required && "*"}
					</label>
				)}
				<div className="input-group">
					<input name={name} value={value} type={type} className={"form-control"} id={id} aria-describedby={ariaLabel} onChange={onChange} placeholder={placeholder} disabled={disabled} />
					{error && error[name] && <div className="d-block invalid-feedback">{error[name][0]}</div>}
				</div>
			</div>
		);
	}
}

InputField.propTypes = {
	name: PropTypes.string,
	value: PropTypes.string,
	onChange: PropTypes.func,
	label: PropTypes.string,
	id: PropTypes.string,
	type: PropTypes.string,
	ariaLabel: PropTypes.string,
	placeholder: PropTypes.string,
	required: PropTypes.bool,
	disabled: PropTypes.bool,
	error: PropTypes.object
};

export default InputField;
