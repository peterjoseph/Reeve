import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { withRouter } from "react-router-dom";
import { Helmet } from "react-helmet";
import { t } from "shared/translations/i18n";
import { REDUX_STATE } from "shared/constants";
import { BILLING, LOAD_CLIENT_SUBSCRIPTION_DETAILS_REJECTED, loadSubscriptionDetails } from "common/store/reducers/billing.js";

import Loading from "common/components/Loading";
import User from "common/components/User";

import NewSubscription from "./components/NewSubscription";

class Billing extends Component {
	componentDidMount() {
		this.props.loadSubscriptionDetails().then(result => {
			if (result.type === LOAD_CLIENT_SUBSCRIPTION_DETAILS_REJECTED) {
				return;
			}
		});
	}

	render() {
		const { loadSubscriptionDetailsStatus } = this.props;

		const helmet = (
			<Helmet>
				<title>{t("headers.billing.title")}</title>
				<meta name="description" content={t("headers.billing.description")} />
			</Helmet>
		);

		const loading = loadSubscriptionDetailsStatus !== REDUX_STATE.FULFILLED;

		// Show loading panel when subscription state has not loaded
		if (loading) {
			return (
				<Fragment>
					{helmet}
					<Loading />
				</Fragment>
			);
		}

		return (
			<Fragment>
				{helmet}
				<NewSubscription />
			</Fragment>
		);
	}
}

Billing.propTypes = {
	history: PropTypes.object,
	user: PropTypes.object,
	loadSubscriptionDetails: PropTypes.func,
	loadSubscriptionDetailsStatus: PropTypes.string
};

function mapStateToProps(state) {
	return {
		loadSubscriptionDetailsStatus: state.getIn([BILLING, "subscriptionDetails", "status"])
	};
}

function mapDispatchToProps(dispatch) {
	return {
		loadSubscriptionDetails: bindActionCreators(loadSubscriptionDetails, dispatch)
	};
}

export default withRouter(
	User(
		connect(
			mapStateToProps,
			mapDispatchToProps
		)(Billing)
	)
);
