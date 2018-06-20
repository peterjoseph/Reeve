import React, { Fragment } from "react";
import { Route } from "react-router";
import { Redirect, BrowserRouter, Switch } from "react-router-dom";
import { ROLE_TYPE } from "~/shared/constants";

import RedirectComponent from "./common/components/RedirectComponent";
import AsyncComponent from "./common/components/AsyncComponent";

import MissingPath from "./common/components/MissingPath";

const Authentication = AsyncComponent(() => import("./modules/authentication"));

class Router extends React.Component {
	render() {
		return (
			<BrowserRouter>
				<Fragment>
					<Switch>
						<RedirectComponent exact path="/" render={props => <Authentication />} />
					</Switch>
				</Fragment>
			</BrowserRouter>
		);
	}
}

export default Router;
