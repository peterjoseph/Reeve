import React, { Component } from "react";
import PropTypes from "prop-types";

import { t } from "shared/translations/i18n";

import User from "common/components/User";

class Dashboard extends Component {
	render() {
		return (
			<div className="container">
				<div className="px-3 py-3 pt-md-5 pb-md-4 mx-auto">
					<div className="mb-3 text-center">
						<h4>{t("label.dashboard")}</h4>
						<div>
							<svg
								width="64px"
								height="64px"
								fill="none"
								stroke="currentColor"
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth="2"
								viewBox="0 0 24 24"
								xmlns="http://www.w3.org/2000/svg"
							>
								<polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
							</svg>
						</div>
					</div>
				</div>
			</div>
		);
	}
}

Dashboard.propTypes = {
	user: PropTypes.object
};

export default User(Dashboard);
