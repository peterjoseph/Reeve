import React from "react";
import PropTypes from "prop-types";
import { BUSINESS_DETAILS } from "~/shared/constants";

class InputField extends React.Component {
	render() {
		const { label, value, onChange, disabled, error } = this.props;

		return (
			<div className="form-group">
				{label && <label htmlFor={"domain-input"}>{label}</label>}
				<div className="input-group">
					<input
						name={"workspaceURL"}
						value={value}
						id="domain-input"
						className={"form-control text-right"}
						type="text"
						placeholder={BUSINESS_DETAILS.COMPANY_NAME}
						onChange={onChange}
						disabled={disabled}
					/>
					<div className="input-group-append">
						<div className="input-group-text">{BUSINESS_DETAILS.DOMAIN}</div>
					</div>
					{error && error["workspaceURL"] && <div className="d-block invalid-feedback">{error["workspaceURL"][0]}</div>}
				</div>
			</div>
		);
	}
}

InputField.propTypes = {
	label: PropTypes.string,
	value: PropTypes.string,
	onChange: PropTypes.func,
	disabled: PropTypes.bool,
	error: PropTypes.object
};

export default InputField;
