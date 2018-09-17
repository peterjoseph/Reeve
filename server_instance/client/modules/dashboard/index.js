import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";
import { Helmet } from "react-helmet";

import { t } from "shared/translations/i18n";

import DashboardIcon from "common/media/icons/Dashboard";
import User from "common/components/User";

class Dashboard extends Component {
	render() {
		return (
			<Fragment>
				<Helmet>
					<title>{t("headers.dashboard.title")}</title>
					<meta name="description" content={t("headers.dashboard.description")} />
				</Helmet>
				<div className="container">
					<div className="px-3 py-3 pt-md-5 pb-md-4 mx-auto">
						<div className="mb-3 text-center">
							<div>
								<DashboardIcon width="48px" height="48px" color="#CCCCCC" />
							</div>
						</div>
					</div>
				</div>
			</Fragment>
		);
	}
}

Dashboard.propTypes = {
	user: PropTypes.object
};

export default User(Dashboard);
