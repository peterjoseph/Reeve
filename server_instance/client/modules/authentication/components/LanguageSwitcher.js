import React, { Component } from "react";

class LanguageSwitcher extends Component {
	render() {
		return (
			<div className="row mt-4 justify-content-center">
				<div className="col-xs-2 col-centered">
					<select className="form-control">
						<option value="english">English</option>
						<option value="italian">Italian</option>
					</select>
				</div>
			</div>
		);
	}
}

export default LanguageSwitcher;
