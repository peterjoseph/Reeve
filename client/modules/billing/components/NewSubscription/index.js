import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
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

	render() {
		return (
			<Fragment>
				<SubscriptionList />
			</Fragment>
		);
	}
}

NewSubscription.propTypes = {
	history: PropTypes.object
};

function mapStateToProps(state) {
	return {};
}

function mapDispatchToProps(dispatch) {
	return {};
}

export default withRouter(
	connect(
		mapStateToProps,
		mapDispatchToProps
	)(NewSubscription)
);
