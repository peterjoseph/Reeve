import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
// import { bindActionCreators } from "redux";
import { withRouter } from "react-router-dom";
import { t } from "shared/translations/i18n";

// import { } from "common/store/reducers/billing.js";

import InputField from "common/components/inputs/InputField";
import Checkbox from "common/components/inputs/Checkbox";
import User from "common/components/User";

class PaymentPlan extends Component {
	render() {
		const { deselectPlan } = this.props;

		return (
			<Fragment>
				<div className="container">
					<div className="subscription-header px-3 py-3 pt-md-5 pb-md-4 mx-auto">
						<div className="mb-3 text-center">
							<h1 className="display-6">Billing Details</h1>
							<p className="lead">
								Start your <strong>Basic</strong> plan today. Pay securely with a credit card.
							</p>
						</div>
					</div>
					<div className="row mb-5">
						<div className="col-5">
							<div className="card rounded-0">
								<div className="card-header bg-white border-bottom-0">
									<h4 className="my-0 mt-2">{t("label.basic")}</h4>
								</div>
								<div className="card-body">
									<ul className="list-unstyled my-4">
										<li>{t("components.billing.cardFeatures.cardOne.1")}</li>
										<li>{t("components.billing.cardFeatures.cardOne.2")}</li>
										<li>{t("components.billing.cardFeatures.cardOne.3")}</li>
										<li>{t("components.billing.cardFeatures.cardOne.4")}</li>
									</ul>
								</div>
								<div className="card-footer text-center">
									<button type="button" className="btn btn-light btn-sm" onClick={deselectPlan}>
										Choose a different Plan
									</button>
								</div>
							</div>
						</div>
						<div className="col-7">
							<div className="border p-3">
								<div>
									<h4>Card Information</h4>
									<hr />
									<InputField
										label={"Name on Card"}
										name={"nameOnCard"}
										id={"name-on-card"}
										value={""}
										type={"textField"}
										placeholder={"JOHN SMITH"}
										ariaLabel={"nameOnCard"}
										onChange={this.changeField}
										disabled={false}
										error={null}
									/>
									<InputField
										label={"Card Number"}
										name={"cardNumber"}
										id={"card-number"}
										value={""}
										type={"textField"}
										placeholder={"0000 0000 0000 0000"}
										ariaLabel={"cardNumber"}
										onChange={this.changeField}
										disabled={false}
										error={null}
									/>
									<div className="row">
										<div className="col-4">
											<InputField
												label={"Expiry Date (MM)"}
												name={"expiryMonth"}
												id={"expiry-month"}
												value={""}
												type={"textField"}
												placeholder={"MM"}
												ariaLabel={"expiryMonth"}
												onChange={this.changeField}
												disabled={false}
												error={null}
											/>
										</div>
										<div className="col-4">
											<InputField
												label={"(YYYY)"}
												name={"expiryYear"}
												id={"expiry-year"}
												value={""}
												type={"textField"}
												placeholder={"YYYY"}
												ariaLabel={"expiryYear"}
												onChange={this.changeField}
												disabled={false}
												error={null}
											/>
										</div>
										<div className="col-4">
											<InputField
												label={"CVC / CVV"}
												name={"ccv"}
												id={"ccv"}
												value={""}
												type={"textField"}
												ariaLabel={"ccv"}
												placeholder={"3 or 4 Digits"}
												onChange={this.changeField}
												disabled={false}
												error={null}
											/>
										</div>
									</div>
									<Checkbox id="billingInfo" name="enableBillingInfo" value={null} onClick={null} disabled={false} label={"Enter optional billing address"} />
								</div>
								{false ==
								(
									<div className="my-4 py-2">
										<h4>Billing Address</h4>
										<hr />
										<div className="row">
											<div className="col-6">
												<InputField
													label={"First Name"}
													name={"firstName"}
													id={"last-name"}
													value={""}
													type={"textField"}
													ariaLabel={"firstName"}
													onChange={this.changeField}
													disabled={false}
													error={null}
												/>
											</div>
											<div className="col-6">
												<InputField
													label={"Last Name"}
													name={"lastName"}
													id={"last-name"}
													value={""}
													type={"textField"}
													ariaLabel={"lastName"}
													onChange={this.changeField}
													disabled={false}
													error={null}
												/>
											</div>
										</div>
										<InputField
											label={"Address Line 1"}
											name={"addressLine1"}
											id={"address-line-1"}
											value={""}
											type={"textField"}
											ariaLabel={"addressLine1"}
											onChange={this.changeField}
											disabled={false}
											error={null}
										/>
										<InputField
											label={"Address Line 2"}
											name={"addressLine2"}
											id={"address-line-2"}
											value={""}
											type={"textField"}
											ariaLabel={"addressLine2"}
											onChange={this.changeField}
											disabled={false}
											error={null}
										/>
										<div className="row">
											<div className="col-6">
												<InputField
													label={"Town / City"}
													name={"city"}
													id={"city"}
													value={""}
													type={"textField"}
													ariaLabel={"city"}
													onChange={this.changeField}
													disabled={false}
													error={null}
												/>
											</div>
											<div className="col-6">
												<InputField
													label={"Postcode"}
													name={"postcode"}
													id={"postcode"}
													value={""}
													type={"textField"}
													ariaLabel={"postcode"}
													onChange={this.changeField}
													disabled={false}
													error={null}
												/>
											</div>
										</div>
										<InputField
											label={"Country"}
											name={"country"}
											id={"country"}
											value={""}
											type={"textField"}
											ariaLabel={"country"}
											onChange={this.changeField}
											disabled={false}
											error={null}
										/>
									</div>
								)}
								<div className="row p-3 text-right">Total billed today ------------ $49.95</div>
								<button type="button" className="btn btn-primary btn-block">
									Subscribe
								</button>
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
	productId: PropTypes.string,
	currency: PropTypes.number,
	interval: PropTypes.number,
	deselectPlan: PropTypes.func,
	loading: PropTypes.bool
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
		)(PaymentPlan)
	)
);
