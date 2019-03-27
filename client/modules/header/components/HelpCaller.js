import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import PropTypes from "prop-types";
import ReactTooltip from "react-tooltip";

import Help from "common/media/icons/Help";
import { t, l } from "shared/translations/i18n";

class HelpCaller extends Component {
	render() {
		const { history } = this.props;

		let articleLink = null;
		switch (history.location.pathname) {
			case "/":
				articleLink = l("supportArticles.overview");
				break;
			case "/profile":
				articleLink = l("supportArticles.profile");
				break;
			case "/profile/change-profile-photo":
				articleLink = l("supportArticles.profile");
				break;
			case "/billing":
				articleLink = l("supportArticles.billing");
				break;
			case "/settings/general":
				articleLink = l("supportArticles.settings");
				break;
			case "/settings/appearance":
				articleLink = l("supportArticles.settings");
				break;
			case "/settings/localization":
				articleLink = l("supportArticles.settings");
				break;
			case "/settings/general/delete-workspace":
				articleLink = l("supportArticles.settings");
				break;
			default:
				articleLink = null;
		}

		// If path parameters are met, display help icon
		if (articleLink !== null) {
			return (
				<li className="nav-item d-none d-md-inline-block">
					<a href={articleLink} target="_blank" className={"nav-link m-1"} data-tip={t("label.helpGuide")} data-for="help">
						<Help width="20px" height="20px" color="#FFF" />
					</a>
					<ReactTooltip id="help" place={"bottom"} effect={"solid"} />
				</li>
			);
		} else {
			return null;
		}
	}
}

HelpCaller.propTypes = {
	history: PropTypes.object
};

export default withRouter(HelpCaller);
