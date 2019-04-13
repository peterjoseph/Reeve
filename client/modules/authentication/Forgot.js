import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { Link, withRouter } from "react-router-dom";
import { Helmet } from "react-helmet";
import validate from "shared/validation/validate";
import { t, activeLanguage, getLNGToken } from "shared/translations/i18n";
import { REDUX_STATE } from "shared/constants";
import { extractSubdomain } from "shared/utilities/domains";
import { variableExists } from "shared/utilities/filters";

import LanguageSwitcher from "./components/LanguageSwitcher";
import { clientStyling } from "./components/ClientStyling";
import { AUTHENTICATION, FORGOT_ACCOUNT_REJECTED, VALIDATE_WORKSPACE_URL_REJECTED, validateWorkspaceURL, forgotAccount } from "../../common/store/reducers/authentication.js";
import { changeLanguage } from "common/store/reducers/language.js";
import { forgot } from "shared/validation/authentication";

import ServerSuccess from "common/components/ServerSuccess";
import ServerError from "common/components/ServerError";
import InputField from "common/components/inputs/InputField";

import LogoIcon from "common/media/icons/Logo";

class Forgot extends Component {
	constructor(props) {
		super(props);

		this.state = {
			emailAddress: "",
			loading: false,
			visible: false,
			validationErrors: null,
			serverError: null
		};

		this.forgot = this.forgot.bind(this);
		this.changeField = this.changeField.bind(this);
	}

	componentDidMount() {
		// Validate workspace url and retrieve client information
		if (this.props.workspaceURLStatus !== REDUX_STATE.FULFILLED) {
			const subdomain = extractSubdomain(window.location.href);
			this.props.validateWorkspaceURL(subdomain).then(result => {
				if (result.type === VALIDATE_WORKSPACE_URL_REJECTED) {
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
	}

	static getDerivedStateFromProps(nextProps, prevState) {
		if (nextProps.workspaceURLStatus === prevState.workspaceURLStatus) {
			return null;
		}
		// Store subdomain in state if valid
		if (nextProps.workspaceURLStatus === REDUX_STATE.FULFILLED) {
			const subdomain = extractSubdomain(window.location.href);
			return {
				workspaceURL: subdomain
			};
		}
		return null;
	}

	changeField(evt) {
		this.setState({
			[evt.target.name]: evt.target.value
		});
	}

	forgot(evt) {
		evt.preventDefault(); // Prevent page refresh

		this.setState({
			loading: true,
			validationErrors: null
		});

		const body = {
			emailAddress: this.state.emailAddress
		};

		// Append workspace name if valid
		if (this.props.workspaceURLStatus === REDUX_STATE.FULFILLED) {
			const subdomain = extractSubdomain(window.location.href);
			Object.assign(body, { workspaceURL: subdomain });
		}

		// Validate input parameters
		const valid = validate(body, forgot());
		if (valid != null) {
			this.setState({
				loading: false,
				validationErrors: valid
			});
		} else {
			this.props.forgotAccount(body).then(result => {
				if (result.type === FORGOT_ACCOUNT_REJECTED) {
					this.setState({
						loading: false,
						serverError: result.payload
					});
				} else {
					this.setState({
						emailAddress: "",
						loading: false
					});
					this.props.history.push("/forgot?email=success");
				}
			});
		}
	}

	render() {
		const { emailAddress, loading, validationErrors, serverError } = this.state;
		const { workspaceURLStatus, forgotAccountStatus, clientStyle } = this.props;

		const workspaceURLPending = workspaceURLStatus == null || workspaceURLStatus == REDUX_STATE.PENDING;
		const successMessage = forgotAccountStatus == REDUX_STATE.FULFILLED && !serverError && !validationErrors;

		// Handle client specific page styling
		const style = clientStyling(workspaceURLStatus, clientStyle);

		return (
			<Fragment>
				<Helmet
					title={t("headers.forgot.title")}
					meta={[
						{
							name: "description",
							content: t("headers.forgot.description")
						}
					]}
				/>
				<div className={`form-container col-xs-12 col-md-6 col-lg-5 d-flex flex-column hidden-md-down ${style.links}`}>
					<div id="forgot">
						<div className="p-3 p-sm-5 alignment vertical justify-content-center">
							<form className="w-100">
								<div className="w-100 text-center mt-4 mb-4">
									<Link to={{ pathname: "/signin" }}>
										<span className="logo">
											{!workspaceURLPending && <img src={(clientStyle && clientStyle.get("logoImage")) || require("distribution/images/logo_dark.svg")} />}
										</span>
									</Link>
								</div>
								{successMessage && <ServerSuccess path={{ email: "success" }} message={t("success.forgotPasswordEmail")} />}
								<ServerError error={serverError} />
								<div className="w-100 mt-3 mb-3">
									<span className="h3"> {t("label.accountDetails")} </span>
								</div>
								<div className="mt-4 mb-4">
									<span>
										{!workspaceURLPending &&
											(workspaceURLStatus === REDUX_STATE.FULFILLED
												? t("components.authentication.forgotAccountDetails.headerPasswordOnly")
												: t("components.authentication.forgotAccountDetails.header"))}
									</span>
									<br />
									<span>{t("components.authentication.forgotAccountDetails.description")}</span>
								</div>
								<InputField
									label={t("label.emailAddress")}
									name={"emailAddress"}
									id={"email-input"}
									value={emailAddress}
									type={"textField"}
									ariaLabel={"emailAddress"}
									onChange={this.changeField}
									disabled={loading}
									error={validationErrors}
								/>
								<button type="submit" className={`btn btn-primary btn-lg btn-block mt-4 p-3 ${style.button}`} onClick={this.forgot} disabled={loading}>
									{t("action.sendEmail")}
								</button>
								<div className="mt-4">
									{t("components.authentication.existingAccount")} <Link to={{ pathname: "/signin" }}>{t("action.signIn")}</Link>
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

Forgot.propTypes = {
	history: PropTypes.object,
	forgotAccount: PropTypes.func,
	validateWorkspaceURL: PropTypes.func,
	workspaceURLStatus: PropTypes.string,
	forgotAccountStatus: PropTypes.string,
	clientStyle: PropTypes.object,
	changeLanguage: PropTypes.func
};

function mapStateToProps(state) {
	return {
		workspaceURLStatus: state.getIn([AUTHENTICATION, "workspaceURL", "status"]),
		forgotAccountStatus: state.getIn([AUTHENTICATION, "forgotAccount", "status"]),
		clientStyle: state.getIn([AUTHENTICATION, "workspaceURL", "payload"])
	};
}

function mapDispatchToProps(dispatch) {
	return {
		forgotAccount: bindActionCreators(forgotAccount, dispatch),
		validateWorkspaceURL: bindActionCreators(validateWorkspaceURL, dispatch),
		changeLanguage: bindActionCreators(changeLanguage, dispatch)
	};
}

export default withRouter(
	connect(
		mapStateToProps,
		mapDispatchToProps
	)(Forgot)
);
