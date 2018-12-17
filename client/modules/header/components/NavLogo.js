import React, { Component } from "react";
import { Link } from "react-router-dom";

class NavLogo extends Component {
	render() {
		return (
			<Link to={"/"} className="navbar-brand mx-2 mr-3" href="#">
				<img src={require("distribution/images/logo_light.svg")} height="20" />
			</Link>
		);
	}
}

export default NavLogo;
