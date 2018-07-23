import React, { Fragment, Component } from "react";
import PropTypes from "prop-types";

import User from "common/components/User";
import VerifyEmail from "./components/VerifyEmail";

class Header extends Component {
	render() {
		const { user } = this.props;

		// Hide header if user is not logged in
		if (!user || !user.get("userId")) {
			return null;
		}

		return (
			<Fragment>
				<VerifyEmail user={user} />
				<div className="navbar navbar-inverse nav navbar-dark bg-dark">
					<div className="navbar-inner">
						<div className="container" />
					</div>
				</div>
			</Fragment>
		);
	}
}

Header.propTypes = {
	user: PropTypes.object
};

export default User(Header);
