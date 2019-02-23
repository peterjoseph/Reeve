import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import PropTypes from "prop-types";

import Help from "common/media/icons/Help";
import { l } from "shared/translations/i18n";

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
			case "/billing":
				articleLink = l("supportArticles.billing");
				break;
			case "/settings":
				articleLink = l("supportArticles.settings");
				break;
			default:
				articleLink = null;
		}

		// If path parameters are met, display help icon
		if (articleLink !== null) {
			return (
				<li className="nav-item d-none d-md-inline-block">
					<a href={articleLink} target="_blank" className={"nav-link m-1"}>
						<Help width="20px" height="20px" color="#FFF" />
					</a>
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
