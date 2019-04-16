import React, { Component } from "react";
import { Route } from "react-router";
import { withRouter } from "react-router-dom";
import ReactGA from "react-ga";

/* eslint-disable */
const enabled = GOOGLE_ANALYTICS_ENABLED;
const tracking = GOOGLE_ANALYTICS_TRACKING;
/* eslint-enable */

export function initializeGA() {
	if (enabled) {
		ReactGA.initialize(tracking);
	}
}

export function setGAUser(userId) {
	if (enabled) {
		ReactGA.set({ userId: userId });
	}
}

class GoogleAnalytics extends Component {
	componentDidMount() {
		this.setPage(this.props.location.pathname, this.props.location.search);
	}

	componentDidUpdate({ location: prevLocation }) {
		const {
			location: { pathname, search }
		} = this.props;
		const differentPathname = pathname !== prevLocation.pathname;
		const differentSearch = search !== prevLocation.search;

		if (differentPathname || differentSearch) {
			this.setPage(pathname, search);
		}
	}

	setPage(pathname, search = "") {
		const page = pathname + search;
		const { location } = window;
		ReactGA.set({
			page,
			location: `${location.origin}${page}`,
			...this.props.options
		});
		ReactGA.pageview(page);
	}

	render() {
		return null;
	}
}

export function GoogleAnalyticsTracker() {
	if (enabled) {
		const Tracker = withRouter(GoogleAnalytics);
		return <Route render={() => <Tracker />} />;
	} else {
		return null;
	}
}

export default GoogleAnalytics;
