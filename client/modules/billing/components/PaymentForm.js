import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
// import { bindActionCreators } from "redux";
import { withRouter } from "react-router-dom";

// import { } from "common/store/reducers/billing.js";

import InputField from "common/components/inputs/InputField";
import Checkbox from "common/components/inputs/Checkbox";
import User from "common/components/User";

class PaymentPlan extends Component {
	render() {
		return (
			<div className="container">
				<div className="subscription-header px-3 py-3 pt-md-5 pb-md-4 mx-auto">
					<div className="mb-3 text-center">
						<button type="button" className="btn btn-secondary btn-sm float-left">
							Back
						</button>
						<h1 className="display-6 font-weight-light">Subscription details</h1>
						<p className="lead">
							Start your <strong>Basic</strong> plan today. Pay securely with a credit card.
						</p>
					</div>
				</div>
				<div className="row mb-5">
					<div className="col-6 border-right" />
					<div className="col-6">
						<div className="p-4">
							<div className="row p-3">
								<div className="float-left">Billed Annually</div>
								<div className="float-right">$49.95</div>
							</div>
							<div className="my-4 py-2">
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
							<div className="row p-3 text-right">Total billed today ------------ $49.95</div>

							<button type="button" className="btn btn-primary btn-block">
								Subscribe
							</button>
						</div>
					</div>
				</div>
			</div>
		);
	}
}

PaymentPlan.propTypes = {
	history: PropTypes.object,
	user: PropTypes.object
};

function mapDispatchToProps(dispatch) {
	return {
		// billing: bindActionCreators(billingFunction, dispatch),
	};
}

export default withRouter(User(connect(null, mapDispatchToProps)(PaymentPlan)));
