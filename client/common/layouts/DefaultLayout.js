import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";
import Header from "client/modules/header";
import GlobalStyling from "common/components/GlobalStyling";

class DefaultLayout extends Component {
	render() {
		const { children } = this.props;

		return (
			<GlobalStyling>
				<Fragment>
					<Header />
					{children}
				</Fragment>
			</GlobalStyling>
		);
	}
}

DefaultLayout.propTypes = {
	children: PropTypes.oneOfType([PropTypes.array, PropTypes.object])
};

export default DefaultLayout;
