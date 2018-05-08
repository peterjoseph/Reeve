import React from "react";
import PropTypes from "prop-types";

class InputField extends React.Component {
  render() {
    const { name, value, onChange, label, id, type, ariaLabel, placeholder, error } = this.props;

    return (
      <div className="form-group">
        {label && <label htmlFor={id}>{label}</label>}
        <input
          name={name}
          value={value}
          type={type}
          className={"form-control"}
          id={id}
          aria-describedby={ariaLabel}
          onChange={onChange}
          placeholder={placeholder}
        />
        {error && <div>error</div>}
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
  error: PropTypes.string
};

export default InputField;
