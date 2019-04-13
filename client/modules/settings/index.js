import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";
import { Route } from "react-router";
import { withRouter, Switch, Link } from "react-router-dom";
import { Helmet } from "react-helmet";

import { t } from "shared/translations/i18n";
import { ROLE_TYPE, FEATURES, SUBSCRIPTION_TYPE } from "shared/constants";

// Import Redux Store
import store, { injectReducer } from "common/store/store";
import settings, { SETTINGS } from "common/store/reducers/settings.js";

import AsyncComponent from "common/components/AsyncComponent";
import HideComponent from "common/components/HideComponent";
import User from "common/components/User";
import MenuLink from "./components/MenuLink";

const GeneralSettings = AsyncComponent(() => import("./components/GeneralSettings/"));
const Appearance = AsyncComponent(() => import("./components/Appearance/"));
const ResetAppearance = AsyncComponent(() => import("./components/ResetAppearance"));
const Localization = AsyncComponent(() => import("./components/Localization/"));
const DeleteWorkspace = AsyncComponent(() => import("./components/DeleteWorkspace"));

class Settings extends Component {
	render() {
		const { history, user } = this.props;

		return (
			<Fragment>
				<Helmet
					title={t("headers.settings.title")}
					meta={[
						{
							name: "description",
							content: t("headers.settings.description")
						}
					]}
				/>
				<div className="container-flexible-height container-fluid">
					<div className="row">
						<nav id="navigation" className="col-md-3 col-lg-2 p-0 d-flex flex-column hidden-md-down border-right bg-light">
							<div className="sticky-sidebar p-3">
								<ul className="nav nav-pills flex-column">
									<MenuLink title={t("components.settings.general.generalSettings")} route={"/settings/general"} isExact={true} />
									<HideComponent user={user} hasAnyRole={[ROLE_TYPE.OWNER, ROLE_TYPE.ADMINISTRATOR]} hasAllFeatures={[FEATURES.STYLING]}>
										<MenuLink title={t("components.settings.appearance.appearanceAndBranding")} route={"/settings/appearance"} isExact={true} />
									</HideComponent>
									<MenuLink title={t("components.settings.localization.languageAndLocalization")} route={"/settings/localization"} isExact={true} />
								</ul>
								<HideComponent
									user={user}
									hasAnyRole={[ROLE_TYPE.OWNER, ROLE_TYPE.FINANCE]}
									hasAllFeatures={[FEATURES.BILLING]}
									hasAnySubscription={[SUBSCRIPTION_TYPE.TRIAL, SUBSCRIPTION_TYPE.BASIC]}
									disabled={!(STRIPE_ENABLED && (user && user.get("subscriptionEndDate") !== null))}
								>
									<Fragment>
										<div className="d-flex justify-content-between align-items-center px-3 mt-4 mb-1 text-muted">
											<span>{t("label.billing")}</span>
										</div>
										<ul className="nav nav-pills flex-column">
											<li className="nav-item my-1">
												<Link to={{ pathname: "/billing" }} className="nav-link py-2">
													{t("components.settings.billingOverview")}
												</Link>
											</li>
										</ul>
									</Fragment>
								</HideComponent>
							</div>
						</nav>
						<div id="content" className="col-md-9 col-lg-10 p-0 bg-white">
							<div className="container m-0 p-0">
								<div className="col-lg-7 p-4">
									<Switch>
										<Route path="/settings/general" render={() => <GeneralSettings location={history.location} />} />
										<Route path="/settings/appearance" render={() => <Appearance location={history.location} />} />
										<Route path="/settings/localization" render={() => <Localization location={history.location} />} />
									</Switch>
								</div>
							</div>
						</div>
					</div>
					<Route path={"/settings/appearance/confirm-reset"} render={() => <ResetAppearance />} />
					<Route path={"/settings/general/delete-workspace"} render={() => <DeleteWorkspace />} />
				</div>
			</Fragment>
		);
	}
}

// Inject Settings Reducer
injectReducer(store, SETTINGS, settings);

Settings.propTypes = {
	history: PropTypes.object,
	user: PropTypes.object
};

export default withRouter(User(Settings));
