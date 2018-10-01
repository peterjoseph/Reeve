import React, { Component } from "react";
import PropTypes from "prop-types";
import { activeLanguage, t } from "shared/translations/i18n";
import { bindActionCreators } from "redux";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";

import { changeLanguage } from "common/store/reducers/language.js";

import EnglandFlagIcon from "common/media/icons/flags/England";
import ItalyFlagIcon from "common/media/icons/flags/Italy";

class LanguageSwitcher extends Component {
	constructor() {
		super();

		this.state = {
			menuVisible: false
		};

		this.languageChange = this.languageChange.bind(this);
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

	languageChange(evt) {
		evt.preventDefault();
		this.props.changeLanguage(evt.target.name);
	}

	flagIcon(lng) {
		switch (lng) {
			case "en":
				return <EnglandFlagIcon width="16px" height="16px" />;
			case "it":
				return <ItalyFlagIcon width="16px" height="16px" />;
			default:
				return null;
		}
	}

	render() {
		const { menuVisible } = this.state;

		const language = activeLanguage();

		return (
			<div className="row mt-4 justify-content-center">
				<div className="col-xs-2 col-centered">
					<div className="dropdown">
						<button className="btn btn-sm dropdown-toggle" type="button" aria-haspopup="true" aria-expanded={menuVisible ? "true" : "false"} onClick={this.showMenu}>
							{this.flagIcon(language)} {language.toUpperCase()}
						</button>
						<div className={`dropdown-menu ${menuVisible ? "d-block" : ""}`} aria-labelledby="dropdownMenuButton">
							<button name="en" className="dropdown-item" onClick={this.languageChange}>
								{this.flagIcon("en")} {t("languages.en")}
							</button>
							<button name="it" className="dropdown-item" onClick={this.languageChange}>
								{this.flagIcon("it")} {t("languages.it")}
							</button>
						</div>
					</div>
				</div>
			</div>
		);
	}
}

LanguageSwitcher.propTypes = {
	changeLanguage: PropTypes.func
};

function mapDispatchToProps(dispatch) {
	return {
		changeLanguage: bindActionCreators(changeLanguage, dispatch)
	};
}

export default withRouter(
	connect(
		null,
		mapDispatchToProps
	)(LanguageSwitcher)
);
