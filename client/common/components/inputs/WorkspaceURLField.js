import React from "react";
import PropTypes from "prop-types";
import { t } from "shared/translations/i18n";

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
						className={"form-control text-right rounded-0"}
						type="text"
						placeholder={t("components.authentication.workspaceName")}
						onChange={onChange}
						disabled={disabled}
					/>
					<div className="input-group-append">
						<div className="input-group-text line-height rounded-0 none">{`.${BUILD_DOMAINPATH /* Environmental variable defined by Webpack DefinePlugin */}`}</div>
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
