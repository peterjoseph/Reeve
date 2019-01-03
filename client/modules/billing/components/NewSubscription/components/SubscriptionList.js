import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
// import { bindActionCreators } from "redux";
import { withRouter } from "react-router-dom";
import moment from "moment";

// import { } from "common/store/reducers/billing.js";
import { SUBSCRIPTION_TYPE, PAYMENT_INTERVALS } from "shared/constants";
import { t, cu } from "shared/translations/i18n";
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
		const { user, interval, changeInterval } = this.props;

		const subscriptionActive = user.get("subscriptionActive"); // Is subscription still active?
		const trialDaysLeft = this.trialDays(); // Calculate days left in trial

		const billingPeriod = (
			<select className="bg-white border-1 p-2" value={interval} onChange={changeInterval}>
				<option value={PAYMENT_INTERVALS.MONTH}>{t("label.monthly")}</option>
				<option value={PAYMENT_INTERVALS.YEAR}>{t("label.yearly")}</option>
			</select>
		);

		return (
			<div className="container">
				<div className="pricing-header px-3 py-3 pt-md-5 pb-md-4 mx-auto text-center">
					<h1>
						{subscriptionActive
							? trialDaysLeft > 0
								? t("components.billing.timeRemaining", { count: trialDaysLeft })
								: t("components.billing.timeRemaining<1")
							: t("components.billing.timeRemaining_expired")}
					</h1>
					<p className="lead">{subscriptionActive ? t("components.billing.selectPlan") : t("components.billing.selectPlan_expired")}</p>
				</div>
				<div className="card-deck mb-3 text-center">
					<div className="card mb-4 rounded-0">
						<div className="card-header">
							<h4 className="my-0 font-weight-normal">{t("label.basic")}</h4>
						</div>
						<div className="card-body">
							<h1 className="card-title pricing-card-title">
								$9<sub className="h6">{cu("AU")}</sub>{" "}
								<small className="text-muted text-lowercase">/ {interval === PAYMENT_INTERVALS.MONTH ? t("label.monthly") : t("label.yearly")}</small>
							</h1>
							<ul className="list-unstyled mt-3 mb-4">
								<li>{t("components.billing.cardFeatures.cardOne.1")}</li>
								<li>{t("components.billing.cardFeatures.cardOne.2")}</li>
								<li>{t("components.billing.cardFeatures.cardOne.3")}</li>
								<li>{t("components.billing.cardFeatures.cardOne.4")}</li>
							</ul>
							<button type="button" className="btn btn-block btn-primary">
								{t("components.billing.chooseThisPlan")}
							</button>
						</div>
					</div>
					<div className="card mb-4 rounded-0">
						<div className="card-header">
							<h4 className="my-0 font-weight-normal">{t("label.standard")}</h4>
						</div>
						<div className="card-body">
							<h1 className="card-title pricing-card-title">
								$15<sub className="h6">{cu("AU")}</sub>{" "}
								<small className="text-muted text-lowercase">/ {interval === PAYMENT_INTERVALS.MONTH ? t("label.monthly") : t("label.yearly")}</small>
							</h1>
							<ul className="list-unstyled mt-3 mb-4">
								<li>{t("components.billing.cardFeatures.cardTwo.1")}</li>
								<li>{t("components.billing.cardFeatures.cardTwo.2")}</li>
								<li>{t("components.billing.cardFeatures.cardTwo.3")}</li>
								<li>{t("components.billing.cardFeatures.cardTwo.4")}</li>
							</ul>
							<button type="button" className="btn btn-block btn-primary">
								{t("components.billing.chooseThisPlan")}
							</button>
						</div>
					</div>
					<div className="card mb-4 rounded-0">
						<div className="card-header">
							<h4 className="my-0 font-weight-normal">{t("label.professional")}</h4>
						</div>
						<div className="card-body">
							<h1 className="card-title pricing-card-title">
								$29<sub className="h6">{cu("AU")}</sub>{" "}
								<small className="text-muted text-lowercase">/ {interval === PAYMENT_INTERVALS.MONTH ? t("label.monthly") : t("label.yearly")}</small>
							</h1>
							<ul className="list-unstyled mt-3 mb-4">
								<li>{t("components.billing.cardFeatures.cardThree.1")}</li>
								<li>{t("components.billing.cardFeatures.cardThree.2")}</li>
								<li>{t("components.billing.cardFeatures.cardThree.3")}</li>
								<li>{t("components.billing.cardFeatures.cardThree.4")}</li>
							</ul>
							<button type="button" className="btn btn-block btn-primary">
								{t("components.billing.chooseThisPlan")}
							</button>
						</div>
					</div>
				</div>
				<div className="mb-4 text-center">
					<span className="lead">
						{t("components.billing.selectBillingFrequency")} {billingPeriod}
					</span>
				</div>
			</div>
		);
	}
}

SubscriptionList.propTypes = {
	history: PropTypes.object,
	user: PropTypes.object,
	interval: PropTypes.string,
	changeInterval: PropTypes.func
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
