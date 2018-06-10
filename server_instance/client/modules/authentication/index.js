import React, { Component } from "react";

import SignIn from "./SignIn";
import Register from "./Register";

class Authentication extends Component {
	render() {
		return (
			<div id="authentication">
				<div className="container-fluid nopadding">
					<div className="row justify-content-center nopadding">
						<SignIn />
					</div>
				</div>
			</div>
		);
	}
}

export default Authentication;
