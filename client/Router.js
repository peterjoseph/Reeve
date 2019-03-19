import React, { Fragment, Component } from "react";
import PropTypes from "prop-types";
import { BrowserRouter, Switch } from "react-router-dom";
import { Redirect } from "react-router";
import { ROLE_TYPE, FEATURES, SUBSCRIPTION_TYPE } from "shared/constants";

import User from "common/components/User";
import RedirectComponent from "common/components/RedirectComponent";
import AsyncComponent from "common/components/AsyncComponent";
import GoogleAnalytics from "common/components/GoogleAnalytics";

// Layout Components
import DefaultLayout from "common/layouts/DefaultLayout";

// Page Components
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
							hasAnyRole={[ROLE_TYPE.OWNER, ROLE_TYPE.ADMINISTRATOR, ROLE_TYPE.FINANCE]}
							user={user}
							render={() => (
								<DefaultLayout key="/">
									<Overview />
								</DefaultLayout>
							)}
						/>
						<RedirectComponent exact path="/signin" hasAnyRole={[ROLE_TYPE.UNREGISTERED]} user={user} render={() => <Authentication />} />
						<RedirectComponent exact path="/signin/help" hasAnyRole={[ROLE_TYPE.UNREGISTERED]} user={user} render={() => <Authentication />} />
						<RedirectComponent exact path="/register" hasAnyRole={[ROLE_TYPE.UNREGISTERED]} user={user} render={() => <Authentication />} />
						<RedirectComponent exact path="/forgot" hasAnyRole={[ROLE_TYPE.UNREGISTERED]} user={user} render={() => <Authentication />} />
						<RedirectComponent exact path="/reset" hasAnyRole={[ROLE_TYPE.UNREGISTERED]} user={user} render={() => <Authentication />} />
						<RedirectComponent exact path="/verify" user={user} render={() => <Authentication />} />
						<RedirectComponent exact path="/verify/email_change" user={user} render={() => <Authentication />} />
						{STRIPE_ENABLED && (user && user.get("subscriptionEndDate") !== null) && (
							<RedirectComponent
								exact
								path="/billing"
								hasAnyRole={[ROLE_TYPE.OWNER, ROLE_TYPE.FINANCE]}
								hasAllFeatures={[FEATURES.BILLING]}
								hasAnySubscription={[SUBSCRIPTION_TYPE.TRIAL, SUBSCRIPTION_TYPE.BASIC]}
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
							hasAnyRole={[ROLE_TYPE.OWNER, ROLE_TYPE.ADMINISTRATOR, ROLE_TYPE.FINANCE]}
							user={user}
							render={() => (
								<DefaultLayout key="/profile">
									<Profile />
								</DefaultLayout>
							)}
						/>
						<RedirectComponent
							exact
							path="/profile/change-profile-photo"
							hasAnyRole={[ROLE_TYPE.OWNER, ROLE_TYPE.ADMINISTRATOR, ROLE_TYPE.FINANCE]}
							user={user}
							render={() => (
								<DefaultLayout key="/profile">
									<Profile />
								</DefaultLayout>
							)}
						/>
						<RedirectComponent exact path="/settings" hasAnyRole={[ROLE_TYPE.OWNER, ROLE_TYPE.ADMINISTRATOR]} user={user} render={() => <Redirect to="/settings/general" />} />
						<RedirectComponent
							exact
							path="/settings/general"
							hasAnyRole={[ROLE_TYPE.OWNER, ROLE_TYPE.ADMINISTRATOR]}
							user={user}
							render={() => (
								<DefaultLayout key="/settings/general">
									<Settings />
								</DefaultLayout>
							)}
						/>
						<RedirectComponent
							exact
							path="/settings/appearance"
							hasAnyRole={[ROLE_TYPE.OWNER, ROLE_TYPE.ADMINISTRATOR]}
							user={user}
							render={() => (
								<DefaultLayout key="/settings/appearance">
									<Settings />
								</DefaultLayout>
							)}
						/>
						<RedirectComponent
							exact
							path="/settings/localization"
							hasAnyRole={[ROLE_TYPE.OWNER, ROLE_TYPE.ADMINISTRATOR]}
							user={user}
							render={() => (
								<DefaultLayout key="/settings/localization">
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
