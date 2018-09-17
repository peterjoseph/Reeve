import React, { Fragment } from "react";
import { Helmet } from "react-helmet";
import PropTypes from "prop-types";
import { t } from "shared/translations/i18n";
import { FEATURES } from "shared/constants";
import { arrayContains } from "shared/utilities/filters";

import User from "common/components/User";

class MissingPath extends React.Component {
	render() {
		const { user } = this.props;

		const subscriptionExpired = user && user.get("subscriptionActive") === false && arrayContains(FEATURES.BILLING, user.get("clientFeatures").toJS() || []);

		return (
			<Fragment>
				<Helmet>
					<title>{t("headers.404.title")}</title>
					<meta name="description" content={t("headers.404.description")} />
				</Helmet>
				<div className="page-not-found container">
					<div className="px-3 py-3 pt-md-5 pb-md-4 mx-auto text-center">
						<h1 className="display-4">{t("label.oops")}</h1>
						<p className="lead">{t("error.code.404")}</p>
						{subscriptionExpired && <p>{t("components.billing.subscriptionExpired")}</p>}
					</div>
				</div>
			</Fragment>
		);
	}
}

MissingPath.propTypes = {
	user: PropTypes.object
};

export default User(MissingPath);
