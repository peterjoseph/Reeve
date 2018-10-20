import React from "react";
import PropTypes from "prop-types";

class Checkbox extends React.Component {
	render() {
		const { name, value, onClick, label, id, smallText, disabled, error } = this.props;

		return (
			<div className="form-check">
				<input id={id} name={name} className="form-check-input" type="checkbox" value={value} onClick={onClick} disabled={disabled} />
				{label && (
					<label className="form-check-label" htmlFor={id}>
						{smallText ? <small>{label}</small> : label}
					</label>
				)}
				{error && error[name] && <div className="d-block invalid-feedback">{error[name][0]}</div>}
			</div>
		);
	}
}

Checkbox.propTypes = {
	name: PropTypes.string,
	value: PropTypes.bool,
	onClick: PropTypes.func,
	label: PropTypes.string,
	id: PropTypes.string,
	smallText: PropTypes.bool,
	disabled: PropTypes.bool,
	error: PropTypes.object
};

export default Checkbox;
