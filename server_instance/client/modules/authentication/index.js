import React from "react";
import PropTypes from "prop-types";

import Login from "./Login"
import Register from "./Register";

class Authentication extends React.Component {
  render() {
    return (
      <div id="authentication">
        <div className="container-fluid h-100">
          <div className="row justify-content-center h-100 nopadding">
            <div className="form-container col-5 hidden-md-down">
              <div className="w-100 pl-5 pr-5 position-absolute border-bottom">
                Login | Register
              </div>
              <span className="justify-content-center">Logo</span>
              <Login />
            </div>
            <div className="background-container col-7 nopadding" />
          </div>
        </div>
      </div>
    );
  }
}

export default Authentication;
