import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import validate from "validate.JS";
import { css } from "emotion";

import { REDUX_STATE } from "~/shared/constants";
import { t } from "~/shared/translations/i18n";
import { extractSubdomain } from "~/shared/utilities/subdomain";

import { AUTHENTICATION, validateWorkspaceURL, loginUser } from "../../common/store/reducers/authentication.js";
import { login } from "~/shared/validation/authentication";

import InputField from "../../common/components/inputs/InputField";

class Login extends Component {
	constructor(props) {
		super(props);

		this.state = {
			workspaceURL: "",
			emailAddress: "",
			password: "",
			keepSignedIn: false,
			loading: false,
			errors: {}
		};

		this.login = this.login.bind(this);
		this.handleChecked = this.handleChecked.bind(this);
		this.changeField = this.changeField.bind(this);
	}

	componentDidMount() {
		// Retrieve current subdomain
		const subdomain = extractSubdomain(window.location.href);
		// Validate workspace url and retrieve client information
		this.props.validateWorkspaceURL(subdomain);
	}

	changeField(evt) {
		this.setState({ [evt.target.name]: evt.target.value });
	}

	handleChecked(evt) {
		this.setState({ [evt.target.name]: !this.state.keepSignedIn });
	}

	login() {
		this.setState({ loading: true, errors: {} });
		const user = {
			workspaceURL: this.state.organizationName,
			emailAddress: this.state.emailAddress,
			password: this.state.password,
			keepSignedIn: this.state.keepSignedIn
		};

		// Validate input parameters
		const valid = validate(user, login);
		if (valid != null) {
			this.setState({
				loading: false,
				errors: valid
			});
		} else {
			this.props.loginUser(user);
		}
	}

	render() {
		const { emailAddress, password, keepSignedIn, loading, errors } = this.state;
		const { workspaceURLStatus, clientStyle } = this.props;

		// Don't return the page if workspaceURL state is still pending
		if (workspaceURLStatus == null || workspaceURLStatus == REDUX_STATE.PENDING) {
			return <div />;
		}

		// Handle client specific page styling
		let clientLoginButton,
			clientLinks,
			clientRightColumn = "";
		if (workspaceURLStatus == REDUX_STATE.FULFILLED && clientStyle != null && clientStyle.size > 0) {
			clientLoginButton = css`
				&,
				&:hover,
				&:active,
				&:visited,
				&:focus {
					background-color: ${clientStyle.get("primaryColor")} !important;
					border-color: ${clientStyle.get("primaryColor")} !important;
				}
				&:hover {
					opacity: 0.9;
				}
			`;
			clientLinks = css`
				a,
				a:active,
				a.visited {
					color: ${clientStyle.get("primaryColor")};
				}
				a:hover {
					color: ${clientStyle.get("primaryColor")};
				}
			`;
			clientRightColumn = css(
				Object.assign(
					{},
					clientStyle.get("backgroundColor") != null && { backgroundColor: clientStyle.get("backgroundColor") },
					clientStyle.get("backgroundImage") && { backgroundImage: `url('${clientStyle.get("backgroundImage")}')` }
				)
			);
		}

		return (
			<Fragment>
				<div className={`form-container col-xs-12 col-md-6 col-lg-5 d-flex flex-column hidden-md-down ${clientLinks}`}>
					<div id="login">
						<div className="p-3 p-sm-5 align-vertical justify-content-center">
							<form className="w-100">
								<div className="w-100 text-center mb-4">
									<span className="logo">
										<img src={clientStyle.get("logoImage") || require("../../common/images/logo_small.png")} />
									</span>
								</div>
								<div className="w-100 mb-3">
									<span className="h3">{t("action.login")}</span>
								</div>
								<InputField
									label={t("label.emailAddress")}
									name="emailAddress"
									id={"email-input"}
									value={emailAddress}
									type={"textField"}
									ariaLabel={"emailAddress"}
									onChange={this.changeField}
									disabled={loading}
									error={errors}
								/>
								<InputField
									label={t("label.password")}
									name="password"
									id={"password-input"}
									value={password}
									type={"password"}
									ariaLabel={"Password"}
									onChange={this.changeField}
									disabled={loading}
									error={errors}
								/>
								<div className="form-row pl-4 pr-1">
									<div className="col">
										<input
											id="signedInCheck"
											name="keepSignedIn"
											className="form-check-input"
											type="checkbox"
											value={keepSignedIn}
											onClick={this.handleChecked}
											disabled={loading}
										/>
										<label className="form-check-label" htmlFor="signedInCheck">
											{t("components.authentication.keepSignedIn")}
										</label>
									</div>
									<div className="col text-right">{t("components.authentication.forgotPassword")}</div>
								</div>
								<button type="button" className={`btn btn-primary btn-lg btn-block mt-4 p-3 ${clientLoginButton}`} onClick={this.login} disabled={loading}>
									{t("action.login")}
								</button>
								<div className="mt-4">
									<span>{"Don't have an account?"}</span> <a href="#">Register</a>
								</div>
							</form>
						</div>
					</div>
				</div>
				<div className={`background-container col-md-6 col-lg-7 ${clientRightColumn}`} />
			</Fragment>
		);
	}
}

Login.propTypes = {
	workspaceURLStatus: PropTypes.string,
	clientStyle: PropTypes.object,
	loginUser: PropTypes.func,
	validateWorkspaceURL: PropTypes.func
};

function mapStateToProps(state) {
	return {
		workspaceURLStatus: state.getIn([AUTHENTICATION, "workspaceURL", "status"]),
		clientStyle: state.getIn([AUTHENTICATION, "workspaceURL", "result"])
	};
}

function mapDispatchToProps(dispatch) {
	return {
		loginUser: bindActionCreators(loginUser, dispatch),
		validateWorkspaceURL: bindActionCreators(validateWorkspaceURL, dispatch)
	};
}

export default connect(mapStateToProps, mapDispatchToProps)(Login);
