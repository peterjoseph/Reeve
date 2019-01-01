import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { withRouter } from "react-router-dom";
import { REDUX_STATE } from "shared/constants";
import { BILLING, LOAD_SUBSCRIPTION_LIST_REJECTED, loadSubscriptionList } from "common/store/reducers/billing.js";

import SubscriptionList from "./components/SubscriptionList";

class NewSubscription extends Component {
	constructor(props) {
		super(props);

		this.state = {
			productId: "",
			interval: "",
			currency: ""
		};
	}

	componentDidMount() {
		if (this.props.loadSubscriptionListStatus !== REDUX_STATE.FULFILLED) {
			this.props.loadSubscriptionList().then(result => {
				if (result.type === LOAD_SUBSCRIPTION_LIST_REJECTED) {
					return;
				}
			});
		}
	}

	componentWillReceiveProps(nextProps) {
		if (nextProps.loadSubscriptionList !== this.props.loadSubscriptionList) {
			this.props.loadSubscriptionList().then(result => {
				if (result.type === LOAD_SUBSCRIPTION_LIST_REJECTED) {
					return;
				}
			});
		}
	}

	render() {
		return (
			<Fragment>
				<SubscriptionList />
			</Fragment>
		);
	}
}

NewSubscription.propTypes = {
	history: PropTypes.object,
	loadSubscriptionList: PropTypes.func,
	loadSubscriptionListStatus: PropTypes.string
};

function mapStateToProps(state) {
	return {
		loadSubscriptionListStatus: state.getIn([BILLING, "subscriptionList", "status"])
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
