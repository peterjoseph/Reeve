import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { withRouter } from "react-router-dom";
import { REDUX_STATE, PAYMENT_INTERVALS, PAYMENT_CURRENCY } from "shared/constants";
import { BILLING, LOAD_SUBSCRIPTION_LIST_REJECTED, loadSubscriptionList } from "common/store/reducers/billing.js";

import Loading from "common/components/Loading";
import ServerError from "common/components/ServerError";
import SubscriptionList from "./components/SubscriptionList";
import PaymentForm from "./components/PaymentForm";

class NewSubscription extends Component {
	constructor(props) {
		super(props);

		this.state = {
			productId: null,
			interval: PAYMENT_INTERVALS.MONTH,
			currency: PAYMENT_CURRENCY.AUD,
			planSelected: false,
			loading: true,
			serverError: null
		};

		this.changeInterval = this.changeInterval.bind(this);
		this.selectPlan = this.selectPlan.bind(this);
		this.deselectPlan = this.deselectPlan.bind(this);
	}

	componentDidMount() {
		this.props.loadSubscriptionList().then(result => {
			if (result.type === LOAD_SUBSCRIPTION_LIST_REJECTED) {
				this.setState({
					loading: false,
					serverError: result.payload
				});
			} else {
				this.setState({
					loading: false,
					serverError: null
				});
			}
		});
	}

	changeInterval(evt) {
		if (evt.target.value == PAYMENT_INTERVALS.MONTH || evt.target.value == PAYMENT_INTERVALS.YEAR) {
			this.setState({ interval: evt.target.value });
		}
	}

	selectPlan(evt) {
		evt.preventDefault();
		this.setState({ productId: evt.target.value, planSelected: true });
	}

	deselectPlan() {
		this.setState({ productId: null, planSelected: false });
	}

	render() {
		const { loading, productId, interval, planSelected, serverError } = this.state;
		const { subscriptionList } = this.props;

		// Display alert and redirect if there is a server error
		if (serverError !== null) {
			return <ServerError error={serverError} />;
		}

		// Show loading panel when subscriptions have not loaded
		if (loading !== false) {
			return <Loading />;
		}

		// Change panel if plan has been selected
		if (productId !== null && planSelected === true) {
			return <PaymentForm deselectPlan={this.deselectPlan} />;
		} else {
			return <SubscriptionList interval={interval} subscriptionList={subscriptionList} changeInterval={this.changeInterval} selectPlan={this.selectPlan} />;
		}
	}
}

NewSubscription.propTypes = {
	history: PropTypes.object,
	loadSubscriptionList: PropTypes.func,
	loadSubscriptionListStatus: PropTypes.string,
	subscriptionList: PropTypes.object
};

function mapStateToProps(state) {
	return {
		loadSubscriptionListStatus: state.getIn([BILLING, "subscriptionList", "status"]),
		subscriptionList: state.getIn([BILLING, "subscriptionList", "payload"])
	};
}

function mapDispatchToProps(dispatch) {
	return {
		loadSubscriptionList: bindActionCreators(loadSubscriptionList, dispatch)
	};
}

export default withRouter(
	connect(
		mapStateToProps,
		mapDispatchToProps
	)(NewSubscription)
);
