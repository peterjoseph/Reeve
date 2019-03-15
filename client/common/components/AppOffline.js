import React, { Component, Fragment } from "react";
import { Helmet } from "react-helmet";
import { t } from "shared/translations/i18n";

class AppOffline extends Component {
	render() {
		return (
			<Fragment>
				<Helmet>
					<title>{t("headers.offline.title")}</title>
					<meta name="description" content={t("headers.offline.description")} />
				</Helmet>
				<div className="offline container">
					<div className="px-3 py-3 pt-md-5 pb-md-4 mx-auto text-center">
						<h1 className="display-4">{t("label.offline")}</h1>
						<p className="lead">{t("components.offline.disconnectedLead")}</p>
						<p>{t("components.offline.continueAsNormal")}</p>
					</div>
				</div>
			</Fragment>
		);
	}
}

export default AppOffline;
