import React, { Component } from "react";

import EnglandFlagIcon from "common/media/icons/flags/England";
import ItalyFlagIcon from "common/media/icons/flags/Italy";

class LanguageSwitcher extends Component {
	render() {
		return (
			<div className="row mt-4 justify-content-center">
				<div className="col-xs-2 col-centered">
					<select className="form-control">
						<option value="english">
							<EnglandFlagIcon width="16px" height="16px" />
						</option>
						<option value="italian">Italian</option>
					</select>
				</div>
			</div>
		);
	}
}

export default LanguageSwitcher;
