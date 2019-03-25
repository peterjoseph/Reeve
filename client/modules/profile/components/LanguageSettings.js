import React, { Component } from "react";
import PropTypes from "prop-types";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

import { REDUX_STATE, LANGUAGE_CODES } from "shared/constants";
import validate from "shared/validation/validate";
import { t, activeLanguage } from "shared/translations/i18n";
import { changeSavedLanguage } from "shared/validation/profile";
import { variableExists } from "shared/utilities/filters";

import { LOAD_USER_REJECTED, loadUser } from "common/store/reducers/authentication";
import { PROFILE } from "common/store/reducers/profile.js";
import { LANGUAGE, CHANGE_LANGUAGE_REJECTED, changeLanguage as changeActiveLanguage, saveUserLanguage } from "common/store/reducers/language.js";

import User from "common/components/User";
import ServerSuccess from "common/components/ServerSuccess";
import ServerError from "common/components/ServerError";

class LanguageSettings extends Component {
	constructor(props) {
		super(props);

		this.state = {
			language: "en",
			loading: false,
			validationErrors: null,
			serverError: null
		};

		this.changeLanguage = this.changeLanguage.bind(this);
		this.selectItem = this.selectItem.bind(this);
	}

	componentDidMount() {
		// Load currently active language
		if (this.props.user) {
			const language = this.props.user.get("language");
			this.setState({
				language: language
			});
		}
	}

	selectItem(evt) {
		this.setState({ [evt.target.name]: evt.target.value });
	}

	changeLanguage(evt) {
		evt.preventDefault(); // Prevent page refresh

		this.setState({
			loading: true,
			validationErrors: null,
			serverError: null
		});

		const body = {
			language: this.state.language
		};

		// Validate input parameters
		const valid = validate(body, changeSavedLanguage());
		if (valid != null) {
			this.setState({
				loading: false,
				validationErrors: valid
			});
		} else {
			this.props.saveUserLanguage(body).then(result => {
				if (result.type === CHANGE_LANGUAGE_REJECTED) {
					this.setState({
						loading: false,
						serverError: result.payload
					});
				} else {
					this.props.loadUser().then(loadUserResult => {
						if (loadUserResult.type === LOAD_USER_REJECTED) {
							this.setState({
								loading: false
							});
							// Reload the web browser as loading the user failed
							window.location.reload;
							return;
						}

						// Load client specific default language
						const lng = loadUserResult.payload.language;
						if (variableExists(lng) && activeLanguage() !== lng) {
							this.props.changeActiveLanguage(lng);
						}

						// Loading is complete
						this.setState({
							loading: false
						});
						this.props.history.push("/profile?changelanguage=success");
					});
				}
			});
		}
	}

	render() {
		const { language, loading, validationErrors, serverError } = this.state;
		const { loadProfileStatus, changeLanguageStatus } = this.props;

		const userProfileLoading = loadProfileStatus !== REDUX_STATE.FULFILLED;
		const disabled = userProfileLoading || loading;

		const successMessage = changeLanguageStatus === REDUX_STATE.FULFILLED && !serverError && !validationErrors;

		return (
			<div>
				{successMessage && <ServerSuccess path={{ changelanguage: "success" }} message={t("success.changeLanguage")} />}
				<ServerError error={serverError} />
				<div className="form-group">
					<label htmlFor="changeLanguageControl">{t("components.profile.activeLanguage")}</label>
					<select
						id="changeLanguageControl"
						className="form-control"
						style={{ border: "0px", outline: "1px solid #CCC", outlineOffset: "-1px" }} // Chrome doesnt like square select fields, so we do some css trickery
						name={"language"}
						value={language}
						onChange={this.selectItem}
						disabled={disabled}
					>
						<option value={LANGUAGE_CODES[1]}>{t("languages.en")}</option>
						<option value={LANGUAGE_CODES[2]}>{t("languages.it")}</option>
					</select>
				</div>
				<button type="submit" className={"btn btn-primary btn-sm btn-block mt-4 p-3"} onClick={this.changeLanguage} disabled={disabled}>
					{t("components.profile.changeLanguage")}
				</button>
			</div>
		);
	}
}

LanguageSettings.propTypes = {
	history: PropTypes.object,
	user: PropTypes.object,
	loadUser: PropTypes.func,
	loadProfileStatus: PropTypes.string,
	changeActiveLanguage: PropTypes.func,
	saveUserLanguage: PropTypes.func,
	changeLanguageStatus: PropTypes.string
};

function mapStateToProps(state) {
	return {
		changeLanguageStatus: state.getIn([LANGUAGE, "changeLanguage", "status"]),
		loadProfileStatus: state.getIn([PROFILE, "loadProfile", "status"])
	};
}

function mapDispatchToProps(dispatch) {
	return {
		loadUser: bindActionCreators(loadUser, dispatch),
		saveUserLanguage: bindActionCreators(saveUserLanguage, dispatch),
		changeActiveLanguage: bindActionCreators(changeActiveLanguage, dispatch)
	};
}

export default User(
	withRouter(
		connect(
			mapStateToProps,
			mapDispatchToProps
		)(LanguageSettings)
	)
);
