import React, { Component } from "react";

import EnglandFlagIcon from "common/media/icons/flags/England";
import ItalyFlagIcon from "common/media/icons/flags/Italy";

class LanguageSwitcher extends Component {
	constructor() {
		super();

		this.state = {
			menuVisible: false
		};

		this.showMenu = this.showMenu.bind(this);
		this.closeMenu = this.closeMenu.bind(this);
	}

	showMenu(evt) {
		evt.preventDefault();

		this.setState({ menuVisible: true }, () => {
			document.addEventListener("click", this.closeMenu);
		});
	}

	closeMenu() {
		this.setState({ menuVisible: false }, () => {
			document.removeEventListener("click", this.closeMenu);
		});
	}

	render() {
		const { menuVisible } = this.state;

		return (
			<div className="row mt-4 justify-content-center">
				<div className="col-xs-2 col-centered">
					<div className="dropdown">
						<button className="btn btn-light btn-sm dropdown-toggle" type="button" aria-haspopup="true" aria-expanded={menuVisible ? "true" : "false"} onClick={this.showMenu}>
							<EnglandFlagIcon width="16px" height="16px" />
						</button>
						<div className={`dropdown-menu ${menuVisible ? "d-block" : ""}`} aria-labelledby="dropdownMenuButton">
							<a className="dropdown-item" href="#">
								<EnglandFlagIcon width="16px" height="16px" /> English
							</a>
							<a className="dropdown-item" href="#">
								<ItalyFlagIcon width="16px" height="16px" /> Italian
							</a>
						</div>
					</div>
				</div>
			</div>
		);
	}
}

export default LanguageSwitcher;
