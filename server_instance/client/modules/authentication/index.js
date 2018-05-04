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
              <div className="pl-5 pr-5 align-vertical justify-content-center">
                <form className="w-100">
                  <div className="w-100 mb-3">
                    <span className="h3">Register</span>
                  </div>
                  <div className="form-row">
                    <div className="col">
                      <InputField
                        label={"First Name"}
                        id={"firstName-input"}
                        type={"textField"}
                        ariaLabel={"firstName"}
                      />
                    </div>
                    <div className="col">
                      <InputField
                        label={"Last Name"}
                        id={"lastName-input"}
                        type={"textField"}
                        ariaLabel={"lastName"}
                      />
                    </div>
                  </div>
                  <InputField
                    label={"Email Address"}
                    id={"email-input"}
                    type={"textField"}
                    ariaLabel={"emailAddress"}
                  />
                  <InputField
                    label={"Password"}
                    id={"password-input"}
                    type={"password"}
                    ariaLabel={"Password"}
                  />
                  <div className="form-group">
                    <label htmlFor={"domain-input"}>{"Workspace URL"}</label>
                    <div class="input-group">
                      <input
                        id="domain-input"
                        className={"form-control"}
                        type="text"
                        placeholder="companyname"
                      />
                      <div class="input-group-append">
                        <div class="input-group-text">.domainname.com</div>
                      </div>
                    </div>
                  </div>
                  <button
                    type="button"
                    class="btn btn-primary btn-lg btn-block mt-4 p-3"
                  >
                    Sign Up
                  </button>
                  <div className="text-center">
                    <span>
                      <small>
                        By signing up, you agree to our Terms & Conditions and
                        Privacy policy
                      </small>
                    </span>
                  </div>
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
