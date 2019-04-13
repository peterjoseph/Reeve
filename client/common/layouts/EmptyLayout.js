import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";
import { withRouter } from "react-router-dom";
import { Offline } from "react-detect-offline";

import AppOffline from "common/components/AppOffline";

class DefaultLayout extends Component {
	render() {
		const { children } = this.props;

		return (
			<Fragment>
				<Offline>
					<AppOffline />
				</Offline>
				{children}
			</Fragment>
		);
	}
}

DefaultLayout.propTypes = {
	children: PropTypes.oneOfType([PropTypes.array, PropTypes.object])
};

export default withRouter(DefaultLayout);
