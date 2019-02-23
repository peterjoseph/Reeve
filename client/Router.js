import React, { Fragment, Component } from "react";
import PropTypes from "prop-types";
import { BrowserRouter, Switch } from "react-router-dom";
import { ROLE_TYPE, FEATURES, SUBSCRIPTION_TYPE } from "shared/constants";

import User from "common/components/User";
import RedirectComponent from "common/components/RedirectComponent";
import AsyncComponent from "common/components/AsyncComponent";
import GoogleAnalytics from "common/components/GoogleAnalytics";

import DefaultLayout from "common/layouts/DefaultLayout";

const Overview = AsyncComponent(() => import("./modules/overview"));
const Authentication = AsyncComponent(() => import("./modules/authentication"));
const Profile = AsyncComponent(() => import("./modules/profile"));
const Billing = AsyncComponent(() => import("./modules/billing"));
const Settings = AsyncComponent(() => import("./modules/settings"));
const MissingPath = AsyncComponent(() => import("common/components/MissingPath"));

class Router extends Component {
	render() {
		const { user } = this.props;

		return (
			<BrowserRouter>
				<Fragment>
					{<GoogleAnalytics.tracker />}
					<Switch>
						<RedirectComponent
							exact
							path="/"
							role={[ROLE_TYPE.OWNER, ROLE_TYPE.ADMINISTRATOR, ROLE_TYPE.FINANCE]}
							user={user}
							render={() => (
								<DefaultLayout key="/">
									<Overview />
								</DefaultLayout>
							)}
						/>
						<RedirectComponent exact path="/signin" role={[ROLE_TYPE.UNREGISTERED]} user={user} render={() => <Authentication />} />
						<RedirectComponent exact path="/signin/help" role={[ROLE_TYPE.UNREGISTERED]} user={user} render={() => <Authentication />} />
						<RedirectComponent exact path="/register" role={[ROLE_TYPE.UNREGISTERED]} user={user} render={() => <Authentication />} />
						<RedirectComponent exact path="/forgot" role={[ROLE_TYPE.UNREGISTERED]} user={user} render={() => <Authentication />} />
						<RedirectComponent exact path="/reset" role={[ROLE_TYPE.UNREGISTERED]} user={user} render={() => <Authentication />} />
						<RedirectComponent exact path="/verify" role={[ROLE_TYPE.UNREGISTERED, ROLE_TYPE.OWNER]} user={user} render={() => <Authentication />} />
						{STRIPE_ENABLED && (user && user.get("subscriptionEndDate") !== null) && (
							<RedirectComponent
								exact
								path="/billing"
								role={[ROLE_TYPE.OWNER, ROLE_TYPE.FINANCE]}
								feature={[FEATURES.BILLING]}
								subscription={[SUBSCRIPTION_TYPE.TRIAL, SUBSCRIPTION_TYPE.BASIC]}
								user={user}
								render={() => (
									<DefaultLayout key="/billing">
										<Billing />
									</DefaultLayout>
								)}
							/>
						)}
						<RedirectComponent
							exact
							path="/profile"
							role={[ROLE_TYPE.OWNER, ROLE_TYPE.ADMINISTRATOR, ROLE_TYPE.FINANCE]}
							user={user}
							render={() => (
								<DefaultLayout key="/profile">
									<Profile />
								</DefaultLayout>
							)}
						/>
						<RedirectComponent
							exact
							path="/settings"
							role={[ROLE_TYPE.OWNER, ROLE_TYPE.ADMINISTRATOR]}
							user={user}
							render={() => (
								<DefaultLayout key="/settings">
									<Settings />
								</DefaultLayout>
							)}
						/>
						<RedirectComponent
							path="*"
							render={() => (
								<DefaultLayout key="*">
									<MissingPath />
								</DefaultLayout>
							)}
						/>
					</Switch>
				</Fragment>
			</BrowserRouter>
		);
	}
}

Router.propTypes = {
	user: PropTypes.object
};

export default User(Router);
