import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
// import { bindActionCreators } from "redux";
import { withRouter } from "react-router-dom";

// import { } from "common/store/reducers/billing.js";

import User from "common/components/User";

class SubscriptionList extends Component {
	render() {
		return (
			<div className="container">
				<div className="pricing-header px-3 py-3 pt-md-5 pb-md-4 mx-auto text-center">
					<h1 className="display-4">Pricing</h1>
					<p className="lead">You are not yet a customer, please select a subscription from below.</p>
				</div>
				<div className="card-deck mb-3 text-center">
					<div className="card mb-4 shadow-sm">
						<div className="card-header">
							<h4 className="my-0 font-weight-normal">Basic</h4>
						</div>
						<div className="card-body">
							<h1 className="card-title pricing-card-title">
								$0 <small className="text-muted">/ mo</small>
							</h1>
							<ul className="list-unstyled mt-3 mb-4">
								<li>10 users included</li>
								<li>2 GB of storage</li>
								<li>Email support</li>
								<li>Help center access</li>
							</ul>
							<button type="button" className="btn btn-block btn-primary">
								Get started
							</button>
						</div>
					</div>
					<div className="card mb-4 shadow-sm">
						<div className="card-header">
							<h4 className="my-0 font-weight-normal">Professional</h4>
						</div>
						<div className="card-body">
							<h1 className="card-title pricing-card-title">
								$15 <small className="text-muted">/ mo</small>
							</h1>
							<ul className="list-unstyled mt-3 mb-4">
								<li>20 users included</li>
								<li>10 GB of storage</li>
								<li>Priority email support</li>
								<li>Help center access</li>
							</ul>
							<button type="button" className="btn btn-block btn-primary">
								Get started
							</button>
						</div>
					</div>
					<div className="card mb-4 shadow-sm">
						<div className="card-header">
							<h4 className="my-0 font-weight-normal">Enterprise</h4>
						</div>
						<div className="card-body">
							<h1 className="card-title pricing-card-title">
								$29 <small className="text-muted">/ mo</small>
							</h1>
							<ul className="list-unstyled mt-3 mb-4">
								<li>30 users included</li>
								<li>15 GB of storage</li>
								<li>Phone and email support</li>
								<li>Help center access</li>
							</ul>
							<button type="button" className="btn btn-block btn-primary">
								Contact us
							</button>
						</div>
					</div>
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

export default withRouter(User(connect(null, mapDispatchToProps)(SubscriptionList)));
