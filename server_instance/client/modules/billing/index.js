import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
// import { bindActionCreators } from "redux";
import { withRouter } from "react-router-dom";

// import { } from "common/store/reducers/billing.js";

import DefaultLayout from "common/layouts/DefaultLayout";
import User from "common/components/User";

// import SubscriptionList from "./components/SubscriptionList";
import PaymentForm from "./components/PaymentForm";

class Billing extends Component {
	render() {
		return (
			<DefaultLayout>
				<PaymentForm />
			</DefaultLayout>
		);
	}
}

Billing.propTypes = {
	history: PropTypes.object,
	user: PropTypes.object
};

function mapDispatchToProps(dispatch) {
	return {
		// billing: bindActionCreators(billingFunction, dispatch),
	};
}

export default withRouter(User(connect(null, mapDispatchToProps)(Billing)));
