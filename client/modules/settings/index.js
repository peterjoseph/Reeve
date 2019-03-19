import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";
import { Route } from "react-router";
import { Switch, Link } from "react-router-dom";
import { Helmet } from "react-helmet";

import { t } from "shared/translations/i18n";
import { ROLE_TYPE, FEATURES, SUBSCRIPTION_TYPE } from "shared/constants";

import AsyncComponent from "common/components/AsyncComponent";
import HideComponent from "common/components/HideComponent";
import User from "common/components/User";
import MenuLink from "./components/MenuLink";

const GeneralSettings = AsyncComponent(() => import("./components/GeneralSettings"));
const Appearance = AsyncComponent(() => import("./components/Appearance"));
const Localization = AsyncComponent(() => import("./components/Localization"));

class Settings extends Component {
	render() {
		const { user } = this.props;

		return (
			<Fragment>
				<Helmet>
					<title>{t("headers.settings.title")}</title>
					<meta name="description" content={t("headers.settings.description")} />
				</Helmet>
				<div className="container-flexible-height container-fluid">
					<div className="row">
						<nav id="navigation" className="col-md-3 col-lg-2 p-0 d-flex flex-column hidden-md-down border-right bg-light">
							<div className="sticky-sidebar p-3">
								<ul className="nav nav-pills flex-column">
									<MenuLink title={t("components.settings.general.generalSettings")} route={"/settings/general"} isExact={true} />
									<MenuLink title={t("components.settings.appearance.appearanceAndBranding")} route={"/settings/appearance"} isExact={true} />
									<MenuLink title={t("components.settings.localization.languageAndLocalization")} route={"/settings/localization"} isExact={true} />
								</ul>

								<HideComponent
									user={user}
									hasAnyRole={[ROLE_TYPE.OWNER, ROLE_TYPE.FINANCE]}
									hasAllFeatures={[FEATURES.BILLING]}
									hasAnySubscription={[SUBSCRIPTION_TYPE.TRIAL, SUBSCRIPTION_TYPE.BASIC]}
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
							<div className="col-md-8 p-4">
								<Switch>
									<Route path="/settings/general" render={() => <GeneralSettings />} />
									<Route path="/settings/appearance" render={() => <Appearance />} />
									<Route path="/settings/localization" render={() => <Localization />} />
								</Switch>
							</div>
						</div>
					</div>
				</div>
			</Fragment>
		);
	}
}

Settings.propTypes = {
	user: PropTypes.object
};

export default User(Settings);
