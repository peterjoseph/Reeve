import React, { Component, Fragment } from "react";
import ScriptLoader from "react-script-loader-hoc";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { StripeProvider, Elements } from "react-stripe-elements";
// import { bindActionCreators } from "redux";
import { withRouter } from "react-router-dom";
import { t } from "shared/translations/i18n";

import { SUBSCRIPTION_TYPE, PAYMENT_INTERVALS } from "shared/constants";

// import { } from "common/store/reducers/billing.js";

import InjectedCardForm from "./InjectedCardForm";
import User from "common/components/User";
import Loading from "common/components/Loading";

class PaymentPlan extends Component {
	handleFormSubmit = async (storage, { token, error }) => {
		return;
	};

	render() {
		const { subscriptionId, deselectPlan, price, interval, scriptsLoadedSuccessfully } = this.props;

		// Load the plan name from our translation file
		const subscriptionType = t(`components.billing.subscriptionType.${subscriptionId}`);

		// Display loading bar while stripe js is fetched from remote location
		if (!scriptsLoadedSuccessfully) {
			return <Loading />;
		}

		return (
			<Fragment>
				<div className="container">
					<div className="subscription-header px-3 py-3 pt-md-5 pb-md-4 mx-auto">
						<div className="mb-3 text-center">
							<h1 className="display-6">Billing Details</h1>
							<p className="lead">
								Start your <strong>{subscriptionType}</strong> plan today. Pay securely with a credit card. Billed{" "}
								{interval === PAYMENT_INTERVALS.MONTH ? t("label.monthly") : t("label.yearly")}.
							</p>
						</div>
					</div>
					<div className="row mb-5">
						<div className="col-4">
							<div className="card rounded-0">
								<div className="card-header bg-white border-bottom-0 text-center">
									<h4 className="my-0 mt-1">
										{subscriptionType} <span className="font-weight-light">plan features</span>
									</h4>
								</div>
								<div className="text-center">
									<h1 className="card-title pricing-card-title pt-3">
										${price}
										<small className="h5 text-muted"> / {interval === PAYMENT_INTERVALS.MONTH ? t("label.month") : t("label.year")}</small>
									</h1>
								</div>
								<div className="card-body py-2 mb-2">
									<ul className="list-unstyled my-2 text-center">
										{subscriptionId == SUBSCRIPTION_TYPE.BASIC && (
											<div>
												<li>{t("components.billing.cardFeatures.cardOne.1")}</li>
												<li>{t("components.billing.cardFeatures.cardOne.2")}</li>
												<li>{t("components.billing.cardFeatures.cardOne.3")}</li>
												<li>{t("components.billing.cardFeatures.cardOne.4")}</li>
											</div>
										)}
										{subscriptionId == SUBSCRIPTION_TYPE.STANDARD && (
											<div>
												<li>{t("components.billing.cardFeatures.cardTwo.1")}</li>
												<li>{t("components.billing.cardFeatures.cardTwo.2")}</li>
												<li>{t("components.billing.cardFeatures.cardTwo.3")}</li>
												<li>{t("components.billing.cardFeatures.cardTwo.4")}</li>
											</div>
										)}
										{subscriptionId == SUBSCRIPTION_TYPE.PROFESSIONAL && (
											<div>
												<li>{t("components.billing.cardFeatures.cardThree.1")}</li>
												<li>{t("components.billing.cardFeatures.cardThree.2")}</li>
												<li>{t("components.billing.cardFeatures.cardThree.3")}</li>
												<li>{t("components.billing.cardFeatures.cardThree.4")}</li>
											</div>
										)}
									</ul>
								</div>
								<div className="card-footer text-center">
									<button type="button" className="btn btn-light btn-sm" onClick={deselectPlan}>
										Choose a different Plan
									</button>
								</div>
							</div>
						</div>
						<div className="col-8">
							<div className="p-3 bg-white border light">
								<h4 className="text-center">Card Information</h4>
								<div className="p-4">
									<StripeProvider apiKey={STRIPE_API_KEY}>
										<Elements>
											<InjectedCardForm onSubmit={this.handleFormSubmit} />
										</Elements>
									</StripeProvider>
								</div>
							</div>
						</div>
					</div>
				</div>
			</Fragment>
		);
	}
}

PaymentPlan.propTypes = {
	history: PropTypes.object,
	user: PropTypes.object,
	productId: PropTypes.number,
	subscriptionId: PropTypes.number,
	currency: PropTypes.number,
	interval: PropTypes.number,
	price: PropTypes.string,
	deselectPlan: PropTypes.func,
	loading: PropTypes.bool,
	scriptsLoadedSuccessfully: PropTypes.bool
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
		)(ScriptLoader("https://js.stripe.com/v3/")(PaymentPlan))
	)
);
