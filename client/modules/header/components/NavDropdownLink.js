import React, { Component } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import HideComponent from "common/components/HideComponent";

import User from "common/components/User";

class NavDropdownLink extends Component {
	render() {
		const { title, route, user, icon, feature, role, subscription, verifiedEmail } = this.props;

		return (
			<HideComponent user={user} feature={feature} role={role} subscription={subscription} verifiedEmail={verifiedEmail}>
				<Link to={route} className="dropdown-item">
					{icon && <span className="mr-1">{icon}</span>} {title}
				</Link>
			</HideComponent>
		);
	}
}

NavDropdownLink.defaultProps = {
	title: "",
	route: "/"
};

NavDropdownLink.propTypes = {
	title: PropTypes.string,
	route: PropTypes.string,
	user: PropTypes.object,
	icon: PropTypes.object,
	feature: PropTypes.oneOfType([PropTypes.array, PropTypes.number]),
	role: PropTypes.oneOfType([PropTypes.array, PropTypes.number]),
	subscription: PropTypes.oneOfType([PropTypes.array, PropTypes.number]),
	verifiedEmail: PropTypes.bool
};

export default User(NavDropdownLink);
