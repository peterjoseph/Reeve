import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { Link, withRouter } from "react-router-dom";
import { Helmet } from "react-helmet";
import validate from "shared/validation/validate";
import queryString from "query-string";
import { t, activeLanguage, getLNGToken } from "shared/translations/i18n";
import { REDUX_STATE } from "shared/constants";
import { extractSubdomain } from "shared/utilities/domains";
import { resetPassword } from "shared/validation/authentication";
import { variableExists } from "shared/utilities/filters";

import LanguageSwitcher from "./components/LanguageSwitcher";
import { clientStyling } from "./components/ClientStyling";
import {
	AUTHENTICATION,
	VALIDATE_WORKSPACE_URL_REJECTED,
	VALIDATE_RESET_PASSWORD_CODE_REJECTED,
	RESET_PASSWORD_REJECTED,
	validateWorkspaceURL,
	validateResetPasswordCode,
	resetUserPassword
} from "common/store/reducers/authentication.js";
import { changeLanguage } from "common/store/reducers/language.js";

import ServerSuccess from "common/components/ServerSuccess";
import ServerError from "common/components/ServerError";
import InputField from "common/components/inputs/InputField";

class ResetPassword extends Component {
	constructor(props) {
		super(props);

		this.state = {
			password: "",
			verifyPassword: "",
			code: "",
			workspaceURL: "",
			loading: false,
			disabled: false,
			visible: false,
			validationErrors: null,
			serverError: null
		};

		this.changeField = this.changeField.bind(this);
		this.reset = this.reset.bind(this);
	}

	componentDidMount() {
		// Validate workspace url and retrieve client information
		const subdomain = extractSubdomain(window.location.href);
		if (this.props.workspaceURLStatus !== REDUX_STATE.FULFILLED) {
			this.props.validateWorkspaceURL(subdomain).then(result => {
				if (result.type === VALIDATE_WORKSPACE_URL_REJECTED) {
					const url = `${BUILD_PROTOCOL}://${BUILD_DOMAINPATH}/`;
					window.location.replace(url);
					return;
				}

				// Load client specific default language
				const lng = result.payload.defaultLanguage;
				const activeBrowserLNG = getLNGToken();
				if (!variableExists(activeBrowserLNG) && variableExists(lng) && activeLanguage() !== lng) {
					this.props.changeLanguage(lng);
				}
			});
		}

		// Verify reset password code exists in url and is valid
		const query = queryString.parse(this.props.history.location.hash);
		if (query.code !== null) {
			this.props.validateResetPasswordCode({ code: query.code, workspaceURL: subdomain }).then(result => {
				if (result.type === VALIDATE_RESET_PASSWORD_CODE_REJECTED) {
					this.setState({
						serverError: result.payload,
						disabled: true
					});
				}
			});
		}
	}

	static getDerivedStateFromProps(nextProps, prevState) {
		if (nextProps.workspaceURLStatus === prevState.workspaceURLStatus && nextProps.validateResetPasswordCodeStatus === prevState.validateResetPasswordCodeStatus) {
			return null;
		}
		const state = {};
		// Store subdomain in state if valid
		if (nextProps.workspaceURLStatus === REDUX_STATE.FULFILLED) {
			const subdomain = extractSubdomain(window.location.href);
			state.workspaceURL = subdomain;
		}
		// Store reset password code in state if valid
		if (nextProps.validateResetPasswordCodeStatus === REDUX_STATE.FULFILLED) {
			const query = queryString.parse(nextProps.history.location.hash);
			state.code = query.code;
		}

		return state;
	}

	changeField(evt) {
		this.setState({
			[evt.target.name]: evt.target.value
		});
	}

	reset(evt) {
		evt.preventDefault(); // Prevent page refresh

		this.setState({
			loading: true,
			validationErrors: null,
			serverError: null
		});

		const password = {
			password: this.state.password,
			verifyPassword: this.state.verifyPassword,
			code: this.state.code,
			workspaceURL: this.state.workspaceURL
		};

		// Validate input parameters
		const valid = validate(password, resetPassword());
		if (valid != null) {
			this.setState({
				loading: false,
				validationErrors: valid
			});
		} else {
			this.props.resetUserPassword(password).then(result => {
				if (result.type === RESET_PASSWORD_REJECTED) {
					this.setState({
						loading: false,
						serverError: result.payload
					});
				} else {
					this.props.history.replace("/signin?reset=success");
				}
			});
		}
	}

	render() {
		const { password, verifyPassword, loading, disabled, validationErrors, serverError } = this.state;
		const { workspaceURLStatus, resetPasswordStatus, clientStyle } = this.props;

		const workspaceURLPending = workspaceURLStatus == null || workspaceURLStatus == REDUX_STATE.PENDING;
		const successMessage = resetPasswordStatus == REDUX_STATE.FULFILLED && !serverError && !validationErrors;

		// Handle client specific page styling
		const style = clientStyling(workspaceURLStatus, clientStyle);

		return (
			<Fragment>
				<Helmet
					title={t("headers.reset.title")}
					meta={[
						{
							name: "description",
							content: t("headers.reset.description")
						}
					]}
				/>
				<div className={`form-container col-xs-12 col-md-6 col-lg-5 d-flex flex-column hidden-md-down ${style.links}`}>
					<div id="reset">
						<div className="p-3 p-sm-5 alignment vertical justify-content-center">
							<form className="w-100">
								<div className="w-100 text-center mt-4 mb-4">
									<span className="logo">{!workspaceURLPending && <img src={(clientStyle && clientStyle.get("logoImage")) || require("distribution/images/logo_dark.svg")} />}</span>
								</div>
								{successMessage && <ServerSuccess path={{ reset: "success" }} message={t("success.resetPassword")} />}
								<ServerError error={serverError} />
								<div className="w-100 mt-3 mb-3">
									<span className="h3"> {t("label.resetPassword")} </span>
								</div>
								<div className="mt-4 mb-4">
									<span>{t("components.authentication.resetPassword.description")}</span>
								</div>
								<InputField
									label={t("label.password")}
									name="password"
									id={"password-input"}
									value={password}
									type={t("label.password")}
									ariaLabel={t("label.password")}
									onChange={this.changeField}
									disabled={loading || disabled}
									error={validationErrors}
								/>
								<InputField
									label={t("label.verifyPassword")}
									name="verifyPassword"
									id={"verify-password-input"}
									value={verifyPassword}
									type={"password"}
									ariaLabel={t("label.verifyPassword")}
									onChange={this.changeField}
									disabled={loading || disabled}
									error={validationErrors}
								/>
								<button type="submit" className={`btn btn-primary btn-lg btn-block mt-4 p-3 ${style.button}`} onClick={this.reset} disabled={loading || disabled}>
									{t("label.resetPassword")}
								</button>
								<div className="mt-4">
									{t("components.authentication.noReset")} <Link to={{ pathname: "/signin" }}>{t("action.signIn")}</Link>
								</div>
								<LanguageSwitcher />
							</form>
						</div>
					</div>
				</div>
				<div className={`background-container col-md-6 col-lg-7 ${style.background}`} />
			</Fragment>
		);
	}
}

ResetPassword.propTypes = {
	history: PropTypes.object,
	validateWorkspaceURL: PropTypes.func,
	validateResetPasswordCode: PropTypes.func,
	resetUserPassword: PropTypes.func,
	workspaceURLStatus: PropTypes.string,
	resetPasswordStatus: PropTypes.string,
	clientStyle: PropTypes.object,
	changeLanguage: PropTypes.func
};

function mapStateToProps(state) {
	return {
		workspaceURLStatus: state.getIn([AUTHENTICATION, "workspaceURL", "status"]),
		validateResetPasswordCodeStatus: state.getIn([AUTHENTICATION, "resetPasswordCode", "status"]),
		resetPasswordStatus: state.getIn([AUTHENTICATION, "resetPassword", "status"]),
		clientStyle: state.getIn([AUTHENTICATION, "workspaceURL", "payload"])
	};
}

function mapDispatchToProps(dispatch) {
	return {
		validateWorkspaceURL: bindActionCreators(validateWorkspaceURL, dispatch),
		validateResetPasswordCode: bindActionCreators(validateResetPasswordCode, dispatch),
		resetUserPassword: bindActionCreators(resetUserPassword, dispatch),
		changeLanguage: bindActionCreators(changeLanguage, dispatch)
	};
}

export default withRouter(
	connect(
		mapStateToProps,
		mapDispatchToProps
	)(ResetPassword)
);
