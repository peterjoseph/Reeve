import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";
import { withRouter } from "react-router-dom";
import moment from "moment";

import { SUBSCRIPTION_TYPE, PAYMENT_INTERVALS } from "shared/constants";
import { t, cu } from "shared/translations/i18n";
import User from "common/components/User";
import Progress from "./Progress";

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

	selectPricing(id) {
		const price = this.props.subscriptionList.find(row => {
			return row.get("id") == id;
		});
		if (price !== null) {
			const priceNum = price.get("price");
			if (priceNum.indexOf(".") > -1 && priceNum.substring(priceNum.indexOf("."), priceNum.length) == ".00") {
				return priceNum.substring(0, priceNum.indexOf("."));
			}
			return price.get("price");
		}
		return null;
	}

	render() {
		const { user, interval, changeInterval, selectPlan } = this.props;

		// Id of plan to show depending on selected interval
		const pricingBox1Id = interval === PAYMENT_INTERVALS.MONTH ? 1 : 4;
		const pricingBox2Id = interval === PAYMENT_INTERVALS.MONTH ? 2 : 5;
		const pricingBox3Id = interval === PAYMENT_INTERVALS.MONTH ? 3 : 6;

		const subscriptionActive = user.get("subscriptionActive"); // Is subscription still active?
		const trialDaysLeft = this.trialDays(); // Calculate days left in trial

		const billingPeriod = (
			<select className="bg-white border-1 p-2" value={interval} onChange={changeInterval}>
				<option value={PAYMENT_INTERVALS.MONTH}>{t("label.monthly")}</option>
				<option value={PAYMENT_INTERVALS.YEAR}>{t("label.yearly")}</option>
			</select>
		);

		return (
			<Fragment>
				<Progress step={1} />
				<div className="container py-3">
					<div className="pricing-header px-3 py-4 pt-md-5 pb-md-5 mx-auto text-center">
						<h1>
							{subscriptionActive
								? trialDaysLeft > 0
									? t("components.billing.timeRemaining", { count: trialDaysLeft })
									: t("components.billing.timeRemaining<1")
								: t("components.billing.timeRemaining_expired")}
						</h1>
						<p className="lead">{subscriptionActive ? t("components.billing.selectPlan") : t("components.billing.selectPlan_expired")}</p>
					</div>
					<div className="card-deck py-3 text-center">
						<div className="card rounded-0">
							<div className="card-header bg-white">
								<h4 className="my-0 font-weight-normal">{t("label.basic")}</h4>
							</div>
							<div className="card-body">
								<h1 className="card-title pricing-card-title">
									${this.selectPricing(pricingBox1Id)}
									<sub className="h6">{cu("AU")}</sub> <small className="h5 text-muted"> / {interval === PAYMENT_INTERVALS.MONTH ? t("label.monthly") : t("label.yearly")}</small>
								</h1>
								<ul className="list-unstyled mt-3 mb-4">
									<li>{t("components.billing.cardFeatures.cardOne.1")}</li>
									<li>{t("components.billing.cardFeatures.cardOne.2")}</li>
									<li>{t("components.billing.cardFeatures.cardOne.3")}</li>
									<li>{t("components.billing.cardFeatures.cardOne.4")}</li>
								</ul>
								<button type="button" value={pricingBox1Id} className="btn btn-block btn-primary" onClick={selectPlan}>
									{t("components.billing.chooseThisPlan")}
								</button>
							</div>
						</div>
						<div className="card rounded-0">
							<div className="card-header bg-white">
								<h4 className="my-0 font-weight-normal">{t("label.standard")}</h4>
							</div>
							<div className="card-body">
								<h1 className="card-title pricing-card-title">
									${this.selectPricing(pricingBox2Id)}
									<sub className="h6">{cu("AU")}</sub> <small className="h5 text-muted"> / {interval === PAYMENT_INTERVALS.MONTH ? t("label.monthly") : t("label.yearly")}</small>
								</h1>
								<ul className="list-unstyled mt-3 mb-4">
									<li>{t("components.billing.cardFeatures.cardTwo.1")}</li>
									<li>{t("components.billing.cardFeatures.cardTwo.2")}</li>
									<li>{t("components.billing.cardFeatures.cardTwo.3")}</li>
									<li>{t("components.billing.cardFeatures.cardTwo.4")}</li>
								</ul>
								<button type="button" value={pricingBox2Id} className="btn btn-block btn-primary" onClick={selectPlan}>
									{t("components.billing.chooseThisPlan")}
								</button>
							</div>
						</div>
						<div className="card rounded-0">
							<div className="card-header bg-white">
								<h4 className="my-0 font-weight-normal">{t("label.professional")}</h4>
							</div>
							<div className="card-body">
								<h1 className="card-title pricing-card-title">
									${this.selectPricing(pricingBox3Id)}
									<sub className="h6">{cu("AU")}</sub> <small className="h5 text-muted"> / {interval === PAYMENT_INTERVALS.MONTH ? t("label.monthly") : t("label.yearly")}</small>
								</h1>
								<ul className="list-unstyled mt-3 mb-4">
									<li>{t("components.billing.cardFeatures.cardThree.1")}</li>
									<li>{t("components.billing.cardFeatures.cardThree.2")}</li>
									<li>{t("components.billing.cardFeatures.cardThree.3")}</li>
									<li>{t("components.billing.cardFeatures.cardThree.4")}</li>
								</ul>
								<button type="button" value={pricingBox3Id} className="btn btn-block btn-primary" onClick={selectPlan}>
									{t("components.billing.chooseThisPlan")}
								</button>
							</div>
						</div>
					</div>
					<div className="my-5 text-center">
						<span className="lead">
							{t("components.billing.selectBillingFrequency")} {billingPeriod}
						</span>
					</div>
				</div>
			</Fragment>
		);
	}
}

SubscriptionList.propTypes = {
	history: PropTypes.object,
	user: PropTypes.object,
	interval: PropTypes.number,
	changeInterval: PropTypes.func,
	selectPlan: PropTypes.func,
	subscriptionList: PropTypes.object
};

export default withRouter(User(SubscriptionList));
