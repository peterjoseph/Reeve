import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
// import { bindActionCreators } from "redux";
import { withRouter } from "react-router-dom";
import moment from "moment";

// import { } from "common/store/reducers/billing.js";
import { SUBSCRIPTION_TYPE } from "shared/constants";
import { t } from "shared/translations/i18n";
import User from "common/components/User";

class SubscriptionList extends Component {
	trialDays() {
		let trialDaysLeft = 0;
		if (this.props.user.get("subscriptionId") == SUBSCRIPTION_TYPE.TRIAL) {
			const currentDate = moment(this.props.user.get("loginTime"));
			const endDate = moment(this.props.user.get("subscriptionEndDate"));
			trialDaysLeft = endDate.diff(currentDate, "days");
		}
		return trialDaysLeft;
	}

	render() {
		const trialDaysLeft = this.trialDays(); // Calculate days left in trial

		const billingPeriod = (
			<select className="bg-white border-0 p-2">
				<option>Monthly</option>
				<option>Annually</option>
			</select>
		);

		const currency = (
			<select className="bg-white border-0 p-2">
				<option>USD</option>
				<option>AUD</option>
			</select>
		);

		return (
			<div className="container">
				<div className="pricing-header px-3 py-3 pt-md-5 pb-md-4 mx-auto text-center">
					<h1>{t("components.billing.timeRemaining", { count: trialDaysLeft })}</h1>
					<p className="lead">{t("components.billing.selectPlan")}</p>
				</div>
				<div className="card-deck mb-3 text-center">
					<div className="card mb-4 shadow-sm">
						<div className="card-header">
							<h4 className="my-0 font-weight-normal">{t("label.basic")}</h4>
						</div>
						<div className="card-body">
							<h1 className="card-title pricing-card-title">
								$9 <small className="text-muted text-lowercase">/ {t("label.month")}</small>
							</h1>
							<ul className="list-unstyled mt-3 mb-4">
								<li>Unique Feature 1</li>
								<li>Unique Feature 2</li>
								<li>Unique Feature 3</li>
								<li>Unique Feature 4</li>
							</ul>
							<button type="button" className="btn btn-block btn-primary">
								{t("components.billing.chooseThisPlan")}
							</button>
						</div>
					</div>
					<div className="card mb-4 shadow-sm">
						<div className="card-header">
							<h4 className="my-0 font-weight-normal">{t("label.standard")}</h4>
						</div>
						<div className="card-body">
							<h1 className="card-title pricing-card-title">
								$15 <small className="text-muted text-lowercase">/ {t("label.month")}</small>
							</h1>
							<ul className="list-unstyled mt-3 mb-4">
								<li>Unique Feature 1</li>
								<li>Unique Feature 2</li>
								<li>Unique Feature 3</li>
								<li>Unique Feature 4</li>
							</ul>
							<button type="button" className="btn btn-block btn-primary">
								{t("components.billing.chooseThisPlan")}
							</button>
						</div>
					</div>
					<div className="card mb-4 shadow-sm">
						<div className="card-header">
							<h4 className="my-0 font-weight-normal">{t("label.professional")}</h4>
						</div>
						<div className="card-body">
							<h1 className="card-title pricing-card-title">
								$29 <small className="text-muted text-lowercase">/ {t("label.month")}</small>
							</h1>
							<ul className="list-unstyled mt-3 mb-4">
								<li>Unique Feature 1</li>
								<li>Unique Feature 2</li>
								<li>Unique Feature 3</li>
								<li>Unique Feature 4</li>
							</ul>
							<button type="button" className="btn btn-block btn-primary">
								{t("components.billing.chooseThisPlan")}
							</button>
						</div>
					</div>
				</div>
				<div className="text-center">
					<span className="lead">
						Billed {billingPeriod} in {currency}
					</span>
				</div>
			</div>
		);
	}
}

SubscriptionList.propTypes = {
	history: PropTypes.object,
	user: PropTypes.object
};

function mapDispatchToProps(dispatch) {
	return {
		// billing: bindActionCreators(billingFunction, dispatch),
	};
}

export default withRouter(
	User(
		connect(
			null,
			mapDispatchToProps
		)(SubscriptionList)
	)
);
