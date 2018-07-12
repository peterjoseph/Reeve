import React, { Component } from "react";
import PropTypes from "prop-types";
import { BrowserRouter, Switch } from "react-router-dom";
import { ROLE_TYPE } from "shared/constants";

import User from "./common/components/User";
import RedirectComponent from "./common/components/RedirectComponent";
import AsyncComponent from "./common/components/AsyncComponent";

const Authentication = AsyncComponent(() => import("./modules/authentication"));
const MissingPath = AsyncComponent(() => import("common/components/MissingPath"));

class Router extends Component {
	render() {
		const { user } = this.props;
		return (
			<BrowserRouter>
				<Switch>
					<RedirectComponent exact path="/" role={[ROLE_TYPE.OWNER]} user={user} render={props => <div>User Logged In</div>} />
					<RedirectComponent exact path="/signin" role={[ROLE_TYPE.UNREGISTERED]} user={user} render={props => <Authentication />} />
					<RedirectComponent exact path="/signin/help" role={[ROLE_TYPE.UNREGISTERED]} user={user} render={props => <Authentication />} />
					<RedirectComponent exact path="/register" role={[ROLE_TYPE.UNREGISTERED]} user={user} render={props => <Authentication />} />
					<RedirectComponent exact path="/forgot" role={[ROLE_TYPE.UNREGISTERED]} user={user} render={props => <Authentication />} />
					<RedirectComponent component={MissingPath} />
				</Switch>
			</BrowserRouter>
		);
	}
}

Router.propTypes = {
	user: PropTypes.object
};

export default User(Router);
