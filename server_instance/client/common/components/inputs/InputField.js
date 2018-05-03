import React from "react";
import PropTypes from "prop-types";

class InputField extends React.Component {
  render() {
    const { label, id, type, ariaLabel, placeholder, error } = this.props;

    return (
      <div className="form-group">
        {label && <label htmlFor={id}>{label}</label>}
        <input
          type={type}
          className={"form-control"}
          id={id}
          aria-describedby={ariaLabel}
          placeholder={placeholder}
        />
        {error && <div>error</div>}
      </div>
    );
  }
}

InputField.propTypes = {
  label: PropTypes.string,
  id: PropTypes.string,
  type: PropTypes.string,
  ariaLabel: PropTypes.string,
  placeholder: PropTypes.string,
  error: PropTypes.string
};

export default InputField;
