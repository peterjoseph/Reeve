import React from "react";
import PropTypes from "prop-types";

import InputField from "../../common/components/inputs/InputField";

class Authentication extends React.Component {
  render() {
    return (
      <div id="authentication">
        <div className="container-fluid h-100">
          <div className="row justify-content-center h-100 nopadding">
            <div className="form-container col-5 hidden-md-down">
              <div className="p-5 justify-content-center">
                <form>
                  <InputField
                    label={"Username"}
                    id={"username-input"}
                    type={"textField"}
                    ariaLabel={"Username"}
                    placeholder={"Username"}
                  />
                  <InputField />
                </form>
              </div>
            </div>
            <div className="background-container col-7 nopadding" />
          </div>
        </div>
      </div>
    );
  }
}

export default Authentication;
