import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";
import { withRouter } from "react-router-dom";
import { Offline } from "react-detect-offline";

import Header from "client/modules/header";
import GlobalStyling from "common/components/GlobalStyling";
import AppOffline from "common/components/AppOffline";

class DefaultLayout extends Component {
	render() {
		const { history, children } = this.props;

		return (
			<GlobalStyling>
				<Fragment>
					<Header key={history.location.key} />
					<div key={history.location.path}>
						<Offline>
							<AppOffline navMargin={true} />
						</Offline>
						{children}
					</div>
				</Fragment>
			</GlobalStyling>
		);
	}
}

DefaultLayout.propTypes = {
	history: PropTypes.object,
	children: PropTypes.oneOfType([PropTypes.array, PropTypes.object])
};

export default withRouter(DefaultLayout);
