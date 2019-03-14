import React, { Component } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import ReactTooltip from "react-tooltip";

import { t } from "shared/translations/i18n";

import Upload from "common/media/icons/Upload";

class Avatar extends Component {
	render() {
		return (
			<div className="profile-icon large mb-3 view overlay rounded-circle d-inline-block">
				<div data-tip={t("components.profile.changeProfilePhoto")}>
					<Link to={{ pathname: "/profile/change-profile-photo" }}>
						<img className="rounded-circle" src={this.props.photo || require("distribution/images/avatar.svg")} />
						<div className="image-overlay rounded-circle">
							<div className="icon">
								<Upload width="1.5rem" height="1.5rem" color="#FFF" />
							</div>
						</div>
					</Link>
					<ReactTooltip place={"right"} effect={"solid"} />
				</div>
			</div>
		);
	}
}

Avatar.propTypes = {
	photo: PropTypes.string
};

export default Avatar;
