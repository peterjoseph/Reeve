import React, { Component } from "react";
import { Route } from "react-router";
import { Switch } from "react-router-dom";

import AsyncComponent from "common/components/AsyncComponent";

import SignIn from "./SignIn";
import Forgot from "./Forgot";

const Register = AsyncComponent(() => import("./Register"));
const ResetPassword = AsyncComponent(() => import("./ResetPassword"));
const VerifyEmail = AsyncComponent(() => import("common/components/verification/VerifyEmail"));
const VerifyEmailChange = AsyncComponent(() => import("common/components/verification/VerifyEmailChange"));

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
							<Route exact path="/reset" render={() => <ResetPassword />} />
							<Route exact path="/verify" render={() => <VerifyEmail />} />
							<Route exact path="/verify/email_change" render={() => <VerifyEmailChange />} />
						</Switch>
					</div>
				</div>
			</div>
		);
	}
}

export default Authentication;
