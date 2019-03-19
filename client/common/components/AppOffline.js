import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";
import { Helmet } from "react-helmet";
import { t } from "shared/translations/i18n";

class AppOffline extends Component {
	render() {
		const { addNavigationMargin } = this.props;
		return (
			<Fragment>
				<Helmet>
					<title>{t("headers.offline.title")}</title>
					<meta name="description" content={t("headers.offline.description")} />
				</Helmet>
				<div className="offline window-overlay light">
					<div className={`alert alert-warning ${addNavigationMargin && "margin nav-height top"} text-center border-0 rounded-0`}>
						<b>{t("label.offline")}</b>: {t("components.offline.disconnectedLead")} {t("components.offline.continueAsNormal")}
					</div>
				</div>
			</Fragment>
		);
	}
}

AppOffline.propTypes = {
	addNavigationMargin: PropTypes.bool
};

export default AppOffline;
