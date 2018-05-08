import React from "react";
import PropTypes from "prop-types";

import InputField from "../../common/components/inputs/InputField";

class Login extends React.Component {
  render() {
    return (
		<div id="login">
			<div className="pl-5 pr-5 align-vertical justify-content-center">
				<form className="w-100">
					<div className="w-100 mb-3">
						<span className="h3">Login</span>
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
					<div className="form-row pl-4 pr-1">
						<div className="col">
							<input class="form-check-input" type="checkbox" value="" id="signedInCheck" />
							<label class="form-check-label" htmlFor="signedInCheck">
								Keep me signed in
							</label>
						</div>
						<div className="col text-right">
							Forgot Password?
						</div>
					</div>
					<button
						type="button"
						class="btn btn-primary btn-lg btn-block mt-4 p-3"
					>
						Login
					</button>
				</form>
			</div>
		</div>
    );
  }
}

export default Login;
