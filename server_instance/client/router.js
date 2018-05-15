import React from "react";
import { Route } from "react-router";
import { Redirect, BrowserRouter, Switch } from "react-router-dom";
import { ROLE_TYPE } from "~/shared/constants";

import AuthenticateRoute from "./common/components/AuthenticateRoute";
import MissingPath from "./common/components/MissingPath";

class Router extends React.Component {
	render() {
		return (
			<BrowserRouter>
				<div>
					<Switch>
						<AuthenticateRoute exact path="/" user={null /* user */} role={null /* Account Type Array */} render={props => <Dashboard user={null /* user */} />} />
						<AuthenticateRoute user={null /* user */} component={MissingPath} />
					</Switch>
				</div>
			</BrowserRouter>
		);
	}
}

export default Router;
