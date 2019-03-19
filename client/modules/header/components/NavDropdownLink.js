import React, { Component } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import HideComponent from "common/components/HideComponent";

import User from "common/components/User";

class NavDropdownLink extends Component {
	render() {
		const { title, route, user, icon, hasAnyRole, hasAllRoles, hasAnyFeature, hasAllFeatures, hasAnySubscription, hasVerifiedEmail } = this.props;

		return (
			<HideComponent
				user={user}
				hasAnyRole={hasAnyRole}
				hasAllRoles={hasAllRoles}
				hasAnyFeature={hasAnyFeature}
				hasAllFeatures={hasAllFeatures}
				hasAnySubscription={hasAnySubscription}
				hasVerifiedEmail={hasVerifiedEmail}
			>
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
	hasAnyRole: PropTypes.oneOfType([PropTypes.array, PropTypes.number]),
	hasAllRoles: PropTypes.oneOfType([PropTypes.array, PropTypes.number]),
	hasAnyFeature: PropTypes.oneOfType([PropTypes.array, PropTypes.number]),
	hasAllFeatures: PropTypes.oneOfType([PropTypes.array, PropTypes.number]),
	hasAnySubscription: PropTypes.oneOfType([PropTypes.array, PropTypes.number]),
	hasVerifiedEmail: PropTypes.bool
};

export default User(NavDropdownLink);
