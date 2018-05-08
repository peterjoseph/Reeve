import React from "react";
import PropTypes from "prop-types";

import InputField from "../../common/components/inputs/InputField";

class Login extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			workspaceURL: "",
			emailAddress: "",
			password: "",
			keepSignedIn: false,
			loading: false,
			errors: {}
		};

		this.login = this.login.bind(this);
		this.handleChecked = this.handleChecked.bind(this);
		this.changeField = this.changeField.bind(this);
	}

	changeField(evt) {
		this.setState({[evt.target.name]: evt.target.value});
	}

	handleChecked(evt) {
    this.setState({[evt.target.name]: !this.state.keepSignedIn});
  }

	login() {
		this.setState({ loading: true });
	}

  render() {
		const { emailAddress, password, keepSignedIn, loading, errors } = this.state;
    return (
		<div id="login">
			<div className="pl-5 pr-5 align-vertical justify-content-center">
				<form className="w-100">
					<div className="w-100 mb-3">
						<span className="h3">Login</span>
					</div>
					<InputField
						label={"Email Address"}
						name="emailAddress"
						id={"email-input"}
						value={emailAddress}
						type={"textField"}
						ariaLabel={"emailAddress"}
						onChange={this.changeField}
						disabled={loading}
					/>
					<InputField
						label={"Password"}
						name="password"
						id={"password-input"}
						value={password}
						type={"password"}
						ariaLabel={"Password"}
						onChange={this.changeField}
						disabled={loading}
					/>
					<div className="form-row pl-4 pr-1">
						<div className="col">
							<input
								id="signedInCheck"
								name="keepSignedIn"
								className="form-check-input"
								type="checkbox"
								value={keepSignedIn}
								onClick={this.handleChecked}
								disabled={loading}
							/>
							<label className="form-check-label" htmlFor="signedInCheck">
								Keep me signed in
							</label>
						</div>
						<div className="col text-right">
							Forgot Password?
						</div>
					</div>
					<button
						type="button"
						className="btn btn-primary btn-lg btn-block mt-4 p-3"
						onClick={this.login}
						disabled={loading}
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
