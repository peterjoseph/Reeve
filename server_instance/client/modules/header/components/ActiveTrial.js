import React, { Component } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";

import User from "common/components/User";

class ActiveTrial extends Component {
	render() {
		const { user } = this.props;

		return (
			<li className="nav-item mx-2 d-none d-md-inline-block">
				<Link to={{ pathname: "/billing" }} className={"nav-link m-1"}>
					<span className="badge badge-danger p-2">9 Days left on Trial</span>
				</Link>
			</li>
		);
	}
}

ActiveTrial.propTypes = {
	user: PropTypes.object
};

export default User(ActiveTrial);
