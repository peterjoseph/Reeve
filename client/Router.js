import React, { Fragment, Component } from "react";
import PropTypes from "prop-types";
import { BrowserRouter, Switch } from "react-router-dom";
import { Redirect } from "react-router";
import { ROLE_TYPE, FEATURES, SUBSCRIPTION_TYPE } from "shared/constants";

import User from "common/components/User";
import ProtectedRoute from "common/components/ProtectedRoute";
import AsyncComponent from "common/components/AsyncComponent";
import GoogleAnalytics from "common/components/GoogleAnalytics";

// Layout Components
import DefaultLayout from "common/layouts/DefaultLayout";
import EmptyLayout from "common/layouts/EmptyLayout";

// Page Components
const Authentication = AsyncComponent(() => import("./modules/authentication"));
const Overview = AsyncComponent(() => import("./modules/overview"));
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
					<GoogleAnalytics.tracker />
					<Switch>
						<ProtectedRoute
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
						<ProtectedRoute
							exact
							path="/signin"
							hasAnyRole={[ROLE_TYPE.UNREGISTERED]}
							user={user}
							render={() => (
								<EmptyLayout key="/signin">
									<Authentication />
								</EmptyLayout>
							)}
						/>
						<ProtectedRoute
							exact
							path="/signin/help"
							hasAnyRole={[ROLE_TYPE.UNREGISTERED]}
							user={user}
							render={() => (
								<EmptyLayout key="/signin/help">
									<Authentication />
								</EmptyLayout>
							)}
						/>
						<ProtectedRoute
							exact
							path="/register"
							hasAnyRole={[ROLE_TYPE.UNREGISTERED]}
							user={user}
							render={() => (
								<EmptyLayout key="/register">
									<Authentication />
								</EmptyLayout>
							)}
						/>
						<ProtectedRoute
							exact
							path="/forgot"
							hasAnyRole={[ROLE_TYPE.UNREGISTERED]}
							user={user}
							render={() => (
								<EmptyLayout key="/forgot">
									<Authentication />
								</EmptyLayout>
							)}
						/>
						<ProtectedRoute
							exact
							path="/reset"
							hasAnyRole={[ROLE_TYPE.UNREGISTERED]}
							user={user}
							render={() => (
								<EmptyLayout key="/reset">
									<Authentication />
								</EmptyLayout>
							)}
						/>
						<ProtectedRoute exact path="/verify" user={user} render={() => <Authentication />} />
						<ProtectedRoute exact path="/verify/email_change" user={user} render={() => <Authentication />} />
						<ProtectedRoute
							exact
							path="/billing"
							hasAnyRole={[ROLE_TYPE.OWNER, ROLE_TYPE.FINANCE]}
							hasAllFeatures={[FEATURES.BILLING]}
							hasAnySubscription={[SUBSCRIPTION_TYPE.TRIAL, SUBSCRIPTION_TYPE.BASIC]}
							user={user}
							disabled={!(STRIPE_ENABLED && (user && user.get("subscriptionEndDate") !== null))}
							render={() => (
								<DefaultLayout key="/billing">
									<Billing />
								</DefaultLayout>
							)}
						/>
						<ProtectedRoute
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
						<ProtectedRoute
							exact
							path="/profile/change-profile-photo"
							hasAnyRole={[ROLE_TYPE.OWNER, ROLE_TYPE.ADMINISTRATOR, ROLE_TYPE.FINANCE]}
							user={user}
							render={() => (
								<DefaultLayout key="/profile/change-profile-photo">
									<Profile />
								</DefaultLayout>
							)}
						/>
						<ProtectedRoute exact path="/settings" hasAnyRole={[ROLE_TYPE.OWNER, ROLE_TYPE.ADMINISTRATOR]} user={user} render={() => <Redirect to="/settings/general" />} />
						<ProtectedRoute
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
						<ProtectedRoute
							exact
							path="/settings/general/delete-workspace"
							hasAllRoles={[ROLE_TYPE.OWNER]}
							user={user}
							render={() => (
								<DefaultLayout key="/settings/general/delete-workspace">
									<Settings />
								</DefaultLayout>
							)}
						/>
						<ProtectedRoute
							exact
							path="/settings/appearance"
							hasAnyRole={[ROLE_TYPE.OWNER, ROLE_TYPE.ADMINISTRATOR]}
							hasAllFeatures={[FEATURES.STYLING]}
							user={user}
							render={() => (
								<DefaultLayout key="/settings/appearance">
									<Settings />
								</DefaultLayout>
							)}
						/>
						<ProtectedRoute
							exact
							path="/settings/appearance/confirm-reset"
							hasAnyRole={[ROLE_TYPE.OWNER, ROLE_TYPE.ADMINISTRATOR]}
							hasAllFeatures={[FEATURES.STYLING]}
							user={user}
							render={() => (
								<DefaultLayout key="/settings/appearance/confirm-reset">
									<Settings />
								</DefaultLayout>
							)}
						/>
						<ProtectedRoute
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
						<ProtectedRoute
							path="*"
							user={user}
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
