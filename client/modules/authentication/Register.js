import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet";
import validate from "shared/validation/validate";
import { t, l, activeLanguage } from "shared/translations/i18n";
import { extractSubdomain } from "shared/utilities/subdomain";

import { registerClient, REGISTER_REJECTED } from "common/store/reducers/authentication.js";
import { register } from "shared/validation/authentication";

import ServerError from "common/components/ServerError";
import InputField from "common/components/inputs/InputField";
import Checkbox from "common/components/inputs/Checkbox";
import WorkspaceURLField from "common/components/inputs/WorkspaceURLField";
import LanguageSwitcher from "./components/LanguageSwitcher";

class Register extends Component {
	constructor(props) {
		super(props);

		this.state = {
			workspaceURL: "",
			firstName: "",
			lastName: "",
			emailAddress: "",
			password: "",
			privacyConsent: false,
			loading: false,
			visible: false,
			validationErrors: null,
			serverError: null
		};

		this.register = this.register.bind(this);
		this.changeField = this.changeField.bind(this);
		this.handleChecked = this.handleChecked.bind(this);
	}

	componentDidMount() {
		// Redirect if user is on register page when there is a subdomain
		const subdomain = extractSubdomain(window.location.href);
		if (subdomain && subdomain.trim() !== null && !BUILD_DOMAINPATH.includes(`${subdomain.trim()}.`)) {
			const url = `${BUILD_PROTOCOL}://${BUILD_DOMAINPATH}/register`;
			window.location.replace(url);
		} else {
			this.setState({ visible: true });
		}
	}

	changeField(evt) {
		this.setState({
			[evt.target.name]: evt.target.value
		});
	}

	handleChecked(evt) {
		this.setState({ [evt.target.name]: !this.state.privacyConsent });
	}

	register(evt) {
		evt.preventDefault(); // Prevent page refresh

		this.setState({
			loading: true,
			validationErrors: null,
			serverError: null
		});

		// Load the browser active language
		const language = activeLanguage();

		const client = {
			workspaceURL: this.state.workspaceURL,
			firstName: this.state.firstName,
			lastName: this.state.lastName,
			emailAddress: this.state.emailAddress,
			password: this.state.password,
			privacyConsent: this.state.privacyConsent,
			language: language
		};

		// Validate input parameters
		const valid = validate(client, register());

		if (valid != null) {
			this.setState({
				loading: false,
				validationErrors: valid
			});
		} else {
			this.props.registerClient(client).then(result => {
				if (result.type === REGISTER_REJECTED) {
					this.setState({
						loading: false,
						serverError: result.payload
					});
				} else {
					const url = `${BUILD_PROTOCOL}://${client.workspaceURL}.${BUILD_DOMAINPATH}/signin?registration=success`;
					window.location.replace(url);
				}
			});
		}
	}

	render() {
		const { firstName, lastName, emailAddress, password, workspaceURL, privacyConsent, visible, loading, serverError, validationErrors } = this.state;
		return (
			<Fragment>
				<Helmet>
					<title>{t("headers.register.title")}</title>
					<meta name="description" content={t("headers.register.description")} />
				</Helmet>
				<div className="form-container col-xs-12 col-md-6 col-lg-5 d-flex flex-column hidden-md-down">
					{visible && (
						<div id="register">
							<div className="p-3 p-sm-5 align-vertical justify-content-center">
								<form className="w-100">
									<div className="w-100 text-center mb-4">
										<span className="logo">
											<img src={require("distribution/images/logo_dark.png")} />
										</span>
									</div>
									<div className="w-100 mb-3">
										<span className="h3"> {t("action.register")} </span>{" "}
									</div>
									<ServerError error={serverError} />
									<div className="form-row">
										<div className="col">
											<InputField
												label={t("label.firstName")}
												name={"firstName"}
												id={"firstName-input"}
												value={firstName}
												type={"textField"}
												ariaLabel={"firstName"}
												onChange={this.changeField}
												disabled={loading}
												error={validationErrors}
											/>
										</div>
										<div className="col">
											<InputField
												label={t("label.lastName")}
												name={"lastName"}
												id={"lastName-input"}
												value={lastName}
												type={"textField"}
												ariaLabel={"lastName"}
												onChange={this.changeField}
												disabled={loading}
												error={validationErrors}
											/>
										</div>
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
									<InputField
										label={t("label.password")}
										name={"password"}
										id={"password-input"}
										value={password}
										type={"password"}
										ariaLabel={"Password"}
										onChange={this.changeField}
										disabled={loading}
										error={validationErrors}
									/>
									<WorkspaceURLField label={t("label.workspaceName")} value={workspaceURL} onChange={this.changeField} disabled={loading} error={validationErrors} />
									<div>
										<div>
											<span>
												<small>
													{t("components.authentication.policyAgreement")}:<br />
													{t("numbers.1")}){" "}
													<a href={l("termsAndConditions")} target="_blank" rel="noopener noreferrer">
														{t("label.termsAndConditions")}
													</a>{" "}
													{t("numbers.2")}){" "}
													<a href={l("privacyPolicy")} target="_blank" rel="noopener noreferrer">
														{t("label.privacyPolicy")}
													</a>
													<br />
												</small>
											</span>
										</div>
										<br />
										<div>
											<Checkbox
												id="privacyConsent"
												name="privacyConsent"
												value={privacyConsent}
												onClick={this.handleChecked}
												smallText
												disabled={loading}
												label={t("components.authentication.privacyConsent")}
												error={validationErrors}
											/>
										</div>
									</div>
									<button type="submit" className="btn btn-primary btn-lg btn-block mt-4 p-3" onClick={this.register} disabled={loading}>
										{t("action.signUp")}
									</button>
									<div className="mt-4">
										{t("components.authentication.existingAccount")} <Link to={{ pathname: "/signin" }}>{t("action.signIn")}</Link>
									</div>
									<LanguageSwitcher />
								</form>
							</div>
						</div>
					)}
				</div>
				<div className="background-container col-md-6 col-lg-7" />
			</Fragment>
		);
	}
}

Register.propTypes = {
	registerClient: PropTypes.func
};

function mapStateToProps(state) {
	return {};
}

function mapDispatchToProps(dispatch) {
	return {
		registerClient: bindActionCreators(registerClient, dispatch)
	};
}

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(Register);
