import React from "react";
import PropTypes from "prop-types";

class InputField extends React.Component {
  render() {
    const { error } = this.props;

    return (
      <div className="input-field">
        <input />
        {error && <div>error</div>}
      </div>
    );
  }
}

InputField.propTypes = {
  error: PropTypes.string
};

export default InputField;
