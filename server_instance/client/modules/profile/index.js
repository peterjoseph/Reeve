import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";
import { Helmet } from "react-helmet";

import { t } from "shared/translations/i18n";

import ProfileIcon from "common/media/icons/Profile";
import User from "common/components/User";

class Profile extends Component {
	render() {
		return (
			<Fragment>
				<Helmet>
					<title>{t("headers.profile.title")}</title>
					<meta name="description" content={t("headers.profile.description")} />
				</Helmet>
				<div className="container">
					<div className="px-3 py-3 pt-md-5 pb-md-4 mx-auto">
						<div className="mb-3 text-center">
							<div>
								<ProfileIcon width="48px" height="48px" color="#CCCCCC" />
							</div>
						</div>
					</div>
				</div>
			</Fragment>
		);
	}
}

Profile.propTypes = {
	user: PropTypes.object
};

export default User(Profile);
