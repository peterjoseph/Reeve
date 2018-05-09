import React from "react";
import PropTypes from "prop-types";

class InputField extends React.Component {
  render() {
    const { value, onChange, disabled, error } = this.props;

    return (
		<div className="form-group">
			<label htmlFor={"domain-input"}>{"Workspace URL"}</label>
			<div className="input-group">
				<input
					name={"workspaceURL"}
					value={value}
					id="domain-input"
					className={"form-control text-right"}
					type="text"
					placeholder="companyname"
					onChange={onChange}
					disabled={disabled}
				/>
				<div className="input-group-append">
					<div className="input-group-text">.domainname.com</div>
				</div>
				{error && error["workspaceURL"] && <div className="d-block invalid-feedback">{error["workspaceURL"]}</div>}
			</div>
		</div>
    );
  }
}

InputField.propTypes = {
  value: PropTypes.string,
  onChange: PropTypes.func,
  disabled: PropTypes.bool,
  error: PropTypes.object
};

export default InputField;
