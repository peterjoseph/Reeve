import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";
import { Route } from "react-router";
import { Link, withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import validate from "validate.JS";
import { Helmet } from "react-helmet";
import fetch from "shared/utilities/fetch";

import { t } from "shared/translations/i18n";
import { saveToken, clearToken } from "shared/utilities/securityToken";
import { REDUX_STATE, SERVER_DETAILS } from "shared/constants";
import { extractSubdomain } from "shared/utilities/subdomain";

import { AUTHENTICATION, LOGIN_REJECTED, validateWorkspaceURL, VALIDATE_WORKSPACE_URL_REJECTED, loginUser, loadUser, LOAD_USER_REJECTED } from "common/store/reducers/authentication.js";
import { login, workspaceURL } from "shared/validation/authentication";

import Alert from "common/components/Alert";
import { clientStyling } from "./components/ClientStyling";
import WorkspaceURL from "./components/WorkspaceURL";
import SignInForm from "./components/SignInForm";
import Loading from "common/components/Loading";

class SignIn extends Component {
	constructor(props) {
		super(props);

		this.state = {
			workspaceURL: "",
			emailAddress: "",
			password: "",
			keepSignedIn: false,
			loginPending: false,
			redirectPending: false,
			validationErrors: null,
			serverError: null
		};

		this.login = this.login.bind(this);
		this.handleChecked = this.handleChecked.bind(this);
		this.changeField = this.changeField.bind(this);
		this.changeSubdomain = this.changeSubdomain.bind(this);
	}

	componentDidMount() {
		// Validate workspace url and retrieve client information
		if (this.props.workspaceURLStatus !== REDUX_STATE.FULFILLED) {
			const subdomain = extractSubdomain(window.location.href);
			this.props.validateWorkspaceURL(subdomain).then(result => {
				if (result.type === VALIDATE_WORKSPACE_URL_REJECTED) {
					this.setState({
						serverError: result.payload
					});
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
		this.setState({ [evt.target.name]: evt.target.value });
	}

	handleChecked(evt) {
		this.setState({ [evt.target.name]: !this.state.keepSignedIn });
	}

	login(evt) {
		evt.preventDefault(); // Prevent page refresh

		this.setState({ loginPending: true, validationErrors: null, serverError: null });
		const user = {
			workspaceURL: this.state.workspaceURL,
			emailAddress: this.state.emailAddress,
			password: this.state.password,
			keepSignedIn: this.state.keepSignedIn
		};

		// Validate input parameters
		const valid = validate(user, login);
		if (valid != null) {
			this.setState({
				loginPending: false,
				validationErrors: valid
			});
		} else {
			this.props.loginUser(user).then(result => {
				if (result.type === LOGIN_REJECTED) {
					clearToken(); // Clear security token if login rejected
					fetch.clearSecurityToken(); // Clear token in fetch header
					this.setState({
						loginPending: false,
						serverError: result.payload
					});
				} else {
					this.props.loadUser().then(result => {
						if (result.type === LOAD_USER_REJECTED) {
							this.setState({
								loginPending: false,
								serverError: result.payload
							});
						}
					});
				}
			});
		}
	}

	changeSubdomain(evt) {
		evt.preventDefault(); // Prevent page refresh

		this.setState({ redirectPending: true, validationErrors: null, serverError: null });
		// Fetch subdomain from state
		const subdomain = {
			workspaceURL: this.state.workspaceURL
		};

		// Validate input parameters
		const valid = validate(subdomain, workspaceURL);
		if (valid != null) {
			this.setState({
				redirectPending: false,
				validationErrors: valid
			});
		} else {
			const url = `${SERVER_DETAILS.PROTOCOL}://${subdomain.workspaceURL}.${SERVER_DETAILS.DOMAIN}/signin`;
			window.location.replace(url);
		}
	}

	render() {
		const { workspaceURL, emailAddress, password, keepSignedIn, loginPending, redirectPending, validationErrors, serverError } = this.state;
		const { workspaceURLStatus, logInStatus, clientStyle, userToken, userKeepSignedIn, history } = this.props;

		const workspaceURLPending = workspaceURLStatus == null || workspaceURLStatus == REDUX_STATE.PENDING;

		// Handle client specific page styling
		const style = clientStyling(this.props.workspaceURLStatus, this.props.clientStyle);

		// Store security token on sign in success
		if (logInStatus == REDUX_STATE.FULFILLED && userToken != null) {
			saveToken(userToken, userKeepSignedIn);
		}

		return (
			<Fragment>
				<Helmet>
					<title>{t("headers.login.title")}</title>
					<meta name="description" content={t("headers.login.description")} />
				</Helmet>
				{(workspaceURLPending || loginPending) && <Loading />}
				<div className={`form-container col-xs-12 col-md-6 col-lg-5 d-flex flex-column hidden-md-down ${style.links}`}>
					<div id="login">
						<div className="p-3 p-sm-5 align-vertical justify-content-center">
							{workspaceURLStatus !== REDUX_STATE.PENDING && (
								<form className="w-100">
									<div className="w-100 text-center mb-4">
										<span className="logo">
											{!workspaceURLPending && <img src={(clientStyle && clientStyle.get("logoImage")) || require("distribution/images/logo_small.png")} />}
										</span>
									</div>
									{workspaceURLStatus == REDUX_STATE.REJECTED && (
										<WorkspaceURL
											workspaceURL={workspaceURL}
											changeSubdomain={this.changeSubdomain}
											changeField={this.changeField}
											redirectPending={redirectPending}
											serverError={serverError}
											validationErrors={validationErrors}
										/>
									)}
									{workspaceURLStatus != REDUX_STATE.REJECTED && (
										<SignInForm
											emailAddress={emailAddress}
											password={password}
											keepSignedIn={keepSignedIn}
											loginPending={loginPending}
											login={this.login}
											handleChecked={this.handleChecked}
											changeField={this.changeField}
											style={style}
											serverError={serverError}
											validationErrors={validationErrors}
										/>
									)}
								</form>
							)}
						</div>
					</div>
				</div>
				<div className={`background-container col-md-6 col-lg-7 ${style.background}`} />
				<Route
					path={"/signin/help"}
					render={() => (
						<Alert title={t("components.authentication.workspaceModal.title")} closeModal={() => history.push("/signin")}>
							<Fragment>
								<div>
									<p>{t("components.authentication.workspaceModal.body", { postProcess: "markdown-jsx" })}</p>
									<ul>
										<li>
											<Link to={{ pathname: "/forgot" }}>{t("components.authentication.workspaceModal.forgotWorkspace")}</Link>
										</li>
										<li>
											<Link to={{ pathname: "/register" }}>{t("components.authentication.workspaceModal.newWorkspace")}</Link>
										</li>
									</ul>
								</div>
							</Fragment>
						</Alert>
					)}
				/>
			</Fragment>
		);
	}
}

SignIn.propTypes = {
	history: PropTypes.object,
	workspaceURLStatus: PropTypes.string,
	logInStatus: PropTypes.string,
	clientStyle: PropTypes.object,
	loginUser: PropTypes.func,
	loadUser: PropTypes.func,
	validateWorkspaceURL: PropTypes.func,
	userToken: PropTypes.string,
	userKeepSignedIn: PropTypes.bool
};

function mapStateToProps(state) {
	return {
		workspaceURLStatus: state.getIn([AUTHENTICATION, "workspaceURL", "status"]),
		logInStatus: state.getIn([AUTHENTICATION, "userLogin", "status"]),
		clientStyle: state.getIn([AUTHENTICATION, "workspaceURL", "payload"]),
		userToken: state.getIn([AUTHENTICATION, "userLogin", "status", "payload", "token"]),
		userKeepSignedIn: state.getIn([AUTHENTICATION, "userLogin", "status", "payload", "keepSignedIn"])
	};
}

function mapDispatchToProps(dispatch) {
	return {
		loginUser: bindActionCreators(loginUser, dispatch),
		loadUser: bindActionCreators(loadUser, dispatch),
		validateWorkspaceURL: bindActionCreators(validateWorkspaceURL, dispatch)
	};
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(SignIn));
