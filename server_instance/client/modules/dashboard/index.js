import React, { Component } from "react";
import PropTypes from "prop-types";

import User from "common/components/User";

class Dashboard extends Component {
	render() {
		return <div>Dashboard</div>;
	}
}

Dashboard.propTypes = {
	user: PropTypes.object
};

export default User(Dashboard);
