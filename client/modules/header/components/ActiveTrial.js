import React, { Component } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import moment from "moment";

import { t } from "shared/translations/i18n";
import { SUBSCRIPTION_TYPE, FEATURES } from "shared/constants";
import { arrayContains } from "shared/utilities/filters";
import User from "common/components/User";

class ActiveTrial extends Component {
	render() {
		const { user } = this.props;

		// Hide component if following requirements are not met
		// Billing Feature, Trial Subscription
		if (user.get("subscriptionId") !== SUBSCRIPTION_TYPE.TRIAL || !arrayContains(FEATURES.BILLING, user.get("clientFeatures").toJS() || [])) {
			return null;
		}

		// Subscription Active?
		const subscriptionActive = user.get("subscriptionActive");

		// Calculate days left in trial
		const currentDate = moment(user.get("loginTime"));
		const endDate = moment(user.get("subscriptionEndDate"));
		const trialDaysLeft = endDate.diff(currentDate, "days");

		return (
			<li className="nav-item mx-2 d-none d-md-inline-block">
				<Link to={{ pathname: "/billing" }} className={"nav-link m-1"}>
					<span className="badge badge-pill badge-success font-weight-normal p-2 px-3">
						{subscriptionActive
							? trialDaysLeft > 0
								? t("components.billing.trialDaysLeft", { count: trialDaysLeft })
								: t("components.billing.trialDays<1")
							: t("components.billing.trialExpired")}
					</span>
				</Link>
			</li>
		);
	}
}

ActiveTrial.propTypes = {
	user: PropTypes.object
};

export default User(ActiveTrial);
