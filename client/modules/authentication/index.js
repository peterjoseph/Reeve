import React, { Component } from "react";
import { Route } from "react-router";
import { Switch } from "react-router-dom";

import SignIn from "./SignIn";
import Register from "./Register";
import Forgot from "./Forgot";
import ResetPassword from "./ResetPassword";
import VerifyEmail from "./VerifyEmail";

class Authentication extends Component {
	render() {
		return (
			<div id="authentication">
				<div className="container-fluid nopadding">
					<div className="row justify-content-center nopadding">
						<Switch>
							<Route path="/signin" render={() => <SignIn />} />
							<Route path="/signin/help" render={() => <SignIn />} />
							<Route path="/register" render={() => <Register />} />
							<Route path="/forgot" render={() => <Forgot />} />
							<Route path="/reset" render={() => <ResetPassword />} />
							<Route path="/verify" render={() => <VerifyEmail />} />
						</Switch>
					</div>
				</div>
			</div>
		);
	}
}

export default Authentication;
