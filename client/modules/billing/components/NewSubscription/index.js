import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { withRouter } from "react-router-dom";
import { REDUX_STATE, PAYMENT_INTERVALS, PAYMENT_INTERVALS_CODES, PAYMENT_CURRENCY, PAYMENT_CURRENCY_CODES } from "shared/constants";
import { BILLING, LOAD_SUBSCRIPTION_LIST_REJECTED, loadSubscriptionList } from "common/store/reducers/billing.js";

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
			serverError: null
		};

		this.changeInterval = this.changeInterval.bind(this);
		this.selectPlan = this.selectPlan.bind(this);
		this.deselectPlan = this.deselectPlan.bind(this);
	}

	componentDidMount() {
		this.props.loadSubscriptionList({ currency: PAYMENT_CURRENCY_CODES[1], interval: PAYMENT_INTERVALS_CODES[1] }).then(result => {
			if (result.type === LOAD_SUBSCRIPTION_LIST_REJECTED) {
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

	changeInterval(evt) {
		let interval = PAYMENT_INTERVALS.MONTH;

		// Adjust interval based on toggle
		if (evt == false) {
			interval = PAYMENT_INTERVALS.MONTH;
		} else {
			interval = PAYMENT_INTERVALS.YEAR;
		}

		// Load subscription list with new interval
		this.props.loadSubscriptionList({ currency: PAYMENT_CURRENCY_CODES[1], interval: PAYMENT_INTERVALS_CODES[interval] }).then(result => {
			if (result.type === LOAD_SUBSCRIPTION_LIST_REJECTED) {
				this.setState({
					interval: interval,
					serverError: result.payload
				});
			} else {
				this.setState({
					interval: interval,
					serverError: null
				});
			}
		});
	}

	selectPlan(evt) {
		evt.preventDefault();
		this.setState({ productId: evt.target.value, planSelected: true });
	}

	deselectPlan() {
		this.setState({ productId: null, planSelected: false });
	}

	render() {
		const { productId, interval, currency, planSelected, serverError } = this.state;
		const { loadSubscriptionListStatus, subscriptionList } = this.props;

		// Display alert and redirect if there is a server error
		if (serverError !== null) {
			return <ServerError error={serverError} />;
		}

		// Page is loading if subscription list is not fulfilled
		const loading = loadSubscriptionListStatus !== REDUX_STATE.FULFILLED;

		// Change panel if plan has been selected
		if (productId !== null && planSelected === true) {
			return <PaymentForm productId={productId} currency={currency} interval={interval} deselectPlan={this.deselectPlan} loading={loading} />;
		} else {
			return <SubscriptionList interval={interval} subscriptionList={subscriptionList} changeInterval={this.changeInterval} selectPlan={this.selectPlan} loading={loading} />;
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
