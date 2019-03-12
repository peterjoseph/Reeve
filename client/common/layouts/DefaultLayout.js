import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";
import { withRouter } from "react-router-dom";

import Header from "client/modules/header";
import GlobalStyling from "common/components/GlobalStyling";

class DefaultLayout extends Component {
	render() {
		const { history, children } = this.props;

		return (
			<GlobalStyling>
				<Fragment>
					<Header key={history.location.key} />
					{children}
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
