import React, { Component } from "react";

import Login from "./Login";
import Register from "./Register";

class Authentication extends Component {
	render() {
		return (
			<div id="authentication">
				<div className="container-fluid nopadding">
					<div className="row justify-content-center nopadding">
						<Login />
					</div>
				</div>
			</div>
		);
	}
}

export default Authentication;
