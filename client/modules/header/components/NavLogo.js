import React, { Component } from "react";
import { Link } from "react-router-dom";

class NavLogo extends Component {
	render() {
		return (
			<Link to={"/"} className="navbar-brand mr-2" href="#">
				<img src={require("distribution/images/logo_light.png")} height="32" />
			</Link>
		);
	}
}

export default NavLogo;
