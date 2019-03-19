import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";
import { Route } from "react-router";
import { Switch } from "react-router-dom";
import { Helmet } from "react-helmet";

import { t } from "shared/translations/i18n";

import AsyncComponent from "common/components/AsyncComponent";
import User from "common/components/User";
import MenuLink from "./components/MenuLink";

const GeneralSettings = AsyncComponent(() => import("./components/GeneralSettings"));
const Appearance = AsyncComponent(() => import("./components/Appearance"));
const Localization = AsyncComponent(() => import("./components/Localization"));

class Settings extends Component {
	render() {
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
