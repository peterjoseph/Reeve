import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
// import { bindActionCreators } from "redux";
import { withRouter } from "react-router-dom";
import { Helmet } from "react-helmet";
import { t } from "shared/translations/i18n";
// import { } from "common/store/reducers/billing.js";

import User from "common/components/User";

import SubscriptionList from "./components/SubscriptionList";
// import PaymentForm from "./components/PaymentForm";

class Billing extends Component {
	render() {
		return (
			<Fragment>
				<Helmet>
					<title>{t("headers.billing.title")}</title>
					<meta name="description" content={t("headers.billing.description")} />
				</Helmet>
				<SubscriptionList />
			</Fragment>
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

export default withRouter(
	User(
		connect(
			null,
			mapDispatchToProps
		)(Billing)
	)
);
