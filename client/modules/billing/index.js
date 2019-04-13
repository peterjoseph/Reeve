import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { withRouter } from "react-router-dom";
import { Helmet } from "react-helmet";
import { t } from "shared/translations/i18n";
import { REDUX_STATE } from "shared/constants";

// Import Redux Store
import store, { injectReducer } from "common/store/store";
import billing, { BILLING, LOAD_CLIENT_SUBSCRIPTION_DETAILS_REJECTED, loadSubscriptionDetails } from "common/store/reducers/billing.js";

import ServerError from "common/components/ServerError";
import User from "common/components/User";

import NewSubscription from "./components/NewSubscription";

class Billing extends Component {
	constructor(props) {
		super(props);

		this.state = {
			serverError: null
		};
	}

	componentDidMount() {
		this.props.loadSubscriptionDetails().then(result => {
			if (result.type === LOAD_CLIENT_SUBSCRIPTION_DETAILS_REJECTED) {
				this.setState({
					serverError: result.payload
				});
			} else {
				this.setState({
					serverError: null
				});
			}
		});
	}

	render() {
		const { loadSubscriptionDetailsStatus } = this.props;
		const { serverError } = this.state;

		// Display alert and redirect if there is a server error
		if (serverError !== null) {
			return <ServerError error={serverError} />;
		}

		// Show loading panel when subscription state has not loaded
		const loading = loadSubscriptionDetailsStatus !== REDUX_STATE.FULFILLED;

		return (
			<Fragment>
				<Helmet
					title={t("headers.billing.title")}
					meta={[
						{
							name: "description",
							content: t("headers.billing.description")
						}
					]}
				/>
				{loading ? null : <NewSubscription />}
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

// Inject Billing Reducer
injectReducer(store, BILLING, billing);

export default withRouter(
	User(
		connect(
			mapStateToProps,
			mapDispatchToProps
		)(Billing)
	)
);
