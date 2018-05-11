import React from "react";
import PropTypes from "prop-types";

import Login from "./Login"
import Register from "./Register";

class Authentication extends React.Component {
  render() {
    return (
      <div id="authentication">
        <div className="background-container nopadding">
          <div className="container-fluid">
            <div className="row justify-content-center nopadding">
              <div className="form-container col-5 d-flex flex-column hidden-md-down">
                <div className="w-100 pl-5 pr-5 border-bottom">
                  Login | Register
                </div>
                <Register />
              </div>
              <div className="col-7" />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Authentication;
