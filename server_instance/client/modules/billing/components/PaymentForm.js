import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
// import { bindActionCreators } from "redux";
import { withRouter } from "react-router-dom";

// import { } from "common/store/reducers/billing.js";

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
				<div className="row">
					<div className="col-3" />
					<div className="col-6">
						<div>
							<div className="row border-top border-bottom p-3">
								<div className="float-left">Billed Annually</div>
								<div className="float-right">$49.95</div>
							</div>
							<div className="mt-4 mb-4">Form Information in here</div>
							<div className="row border-top border-bottom p-3 text-right">Total Billed: $49.95</div>
						</div>
						<button type="button" className="btn btn-primary btn-block">
							Subscribe
						</button>
					</div>
					<div className="col-3" />
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
