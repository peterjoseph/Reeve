import React, { Component } from "react";
import PropTypes from "prop-types";

import { t } from "shared/translations/i18n";

import DefaultLayout from "common/layouts/DefaultLayout";
import SettingsIcon from "common/media/icons/Settings";
import User from "common/components/User";

class Settings extends Component {
	render() {
		return (
			<DefaultLayout>
				<div className="container">
					<div className="px-3 py-3 pt-md-5 pb-md-4 mx-auto">
						<div className="mb-3 text-center">
							<div>
								<SettingsIcon width="48px" height="48px" color="#CCCCCC" />
							</div>
						</div>
					</div>
				</div>
			</DefaultLayout>
		);
	}
}

Settings.propTypes = {
	user: PropTypes.object
};

export default User(Settings);
