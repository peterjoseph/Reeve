import React from "react";
import PropTypes from "prop-types";

import InputField from "../../common/components/inputs/InputField";

class Register extends React.Component {
constructor(props) {
	super(props);

	this.state = {
		workspaceURL: "",
		firstName: "",
		lastName: "",
		emailAddress: "",
		password: "",
		loading: false,
		errors: {}
	};

	this.register = this.register.bind(this);
	this.changeField = this.changeField.bind(this);
}

changeField(evt) {
	this.setState({[evt.target.name]: evt.target.value});
}

register() {
	this.setState({ loading: true });
}

  render() {
	const { firstName, lastName, emailAddress, password, loading, errors } = this.state;
    return (
		<div id="register">
			<div className="pl-5 pr-5 align-vertical justify-content-center">
				<form className="w-100">
					<div className="w-100 mb-3">
						<span className="h3">Register</span>
					</div>
					<div className="form-row">
						<div className="col">
						<InputField
							label={"First Name"}
							name={"firstName"}
							id={"firstName-input"}
							value={firstName}
							type={"textField"}
							ariaLabel={"firstName"}
							onChange={this.changeField}
							disabled={loading}
						/>
						</div>
						<div className="col">
						<InputField
							label={"Last Name"}
							name={"lastName"}
							id={"lastName-input"}
							value={lastName}
							type={"textField"}
							ariaLabel={"lastName"}
							onChange={this.changeField}
							disabled={loading}
						/>
						</div>
					</div>
					<InputField
						label={"Email Address"}
						name={"emailAddress"}
						id={"email-input"}
						value={emailAddress}
						type={"textField"}
						ariaLabel={"emailAddress"}
						onChange={this.changeField}
						disabled={loading}
					/>
					<InputField
						label={"Password"}
						name={"password"}
						id={"password-input"}
						value={password}
						type={"password"}
						ariaLabel={"Password"}
						onChange={this.changeField}
						disabled={loading}
					/>
					<div className="form-group">
						<label htmlFor={"domain-input"}>{"Workspace URL"}</label>
						<div className="input-group">
						<input
							id="domain-input"
							className={"form-control text-right"}
							type="text"
							placeholder="companyname"
						/>
						<div className="input-group-append">
							<div className="input-group-text">.domainname.com</div>
						</div>
						</div>
					</div>
					<button
						type="button"
						className="btn btn-primary btn-lg btn-block mt-4 p-3"
						onClick={this.register}
						disabled={loading}
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
    );
  }
}

export default Register;
