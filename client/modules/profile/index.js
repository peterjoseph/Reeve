import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";
import { Helmet } from "react-helmet";

import { t } from "shared/translations/i18n";

import User from "common/components/User";

import ChangePassword from "./components/ChangePassword";

class Profile extends Component {
	render() {
		const { user } = this.props;

		return (
			<Fragment>
				<Helmet>
					<title>{t("headers.profile.title")}</title>
					<meta name="description" content={t("headers.profile.description")} />
				</Helmet>
				<div className="container">
					<div className="px-md-3 py-3 pt-5 pb-md-4 mx-auto">
						<div className="mb-3">
							<div className="col-md-8 mx-auto">
								<div className="text-center">
									<div className="profile-icon large mb-3 rounded-circle d-inline-block">
										<img src={user.get("profilePhoto") || require("distribution/images/avatar.svg")} className="rounded-circle" />
									</div>
									<h3 className="text-capitalize">
										{user.get("firstName")} {user.get("lastName")}
									</h3>
								</div>
								<div className="mt-3 mb-5">
									<h5>{t("label.profile")}</h5>
									<div className="card rounded-0 mb-3 text-left">
										<div className="card-body">Input</div>
									</div>
								</div>
								<div className="my-5">
									<h5>{t("label.languageSettings")}</h5>
									<div className="card rounded-0 mb-3 text-left">
										<div className="card-body">Input</div>
									</div>
								</div>
								<div className="my-5">
									<h5>{t("components.profile.changePassword")}</h5>
									<div className="card rounded-0 mb-3 text-left">
										<div className="card-body">
											<ChangePassword />
										</div>
									</div>
								</div>
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
