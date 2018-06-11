import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import validate from "validate.JS";
import { css } from "emotion";

import { REDUX_STATE } from "~/shared/constants";
import { extractSubdomain } from "~/shared/utilities/subdomain";

import { AUTHENTICATION, validateWorkspaceURL, loginUser } from "../../common/store/reducers/authentication.js";
import { login, workspaceURL } from "~/shared/validation/authentication";

import WorkspaceURL from "./components/WorkspaceURL";
import LoginForm from "./components/LoginForm";
import Loading from "../../common/components/Loading";

class SignIn extends Component {
	constructor(props) {
		super(props);

		this.state = {
			workspaceURL: "",
			emailAddress: "",
			password: "",
			keepSignedIn: false,
			loginPending: false,
			errors: {}
		};

		this.login = this.login.bind(this);
		this.handleChecked = this.handleChecked.bind(this);
		this.changeField = this.changeField.bind(this);
		this.changeSubdomain = this.changeSubdomain.bind(this);
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

	clientStyling() {
		const style = { button: "", links: "", background: "" };
		if (this.props.workspaceURLStatus == REDUX_STATE.FULFILLED && this.props.clientStyle != null && this.props.clientStyle.size > 0) {
			style.button = css`
				&,
				&:hover,
				&:active,
				&:visited,
				&:focus {
					background-color: ${this.props.clientStyle.get("primaryColor")} !important;
					border-color: ${this.props.clientStyle.get("primaryColor")} !important;
				}
				&:hover {
					opacity: 0.9;
				}
			`;
			style.links = css`
				a,
				a:active,
				a.visited {
					color: ${this.props.clientStyle.get("primaryColor")};
				}
				a:hover {
					color: ${this.props.clientStyle.get("primaryColor")};
				}
			`;
			style.background = css(
				Object.assign(
					{},
					this.props.clientStyle.get("backgroundColor") != null && { backgroundColor: this.props.clientStyle.get("backgroundColor") },
					this.props.clientStyle.get("backgroundImage") && { backgroundImage: `url('${this.props.clientStyle.get("backgroundImage")}')` }
				)
			);
		}
		return style;
	}

	login() {
		this.setState({ loginPending: true, errors: {} });
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
				errors: valid
			});
		} else {
			this.props.loginUser(user);
		}
	}

	changeSubdomain() {
		// Fetch subdomain from state
		const subdomain = {
			workspaceURL: this.state.workspaceURL
		};

		// Validate input parameters
		this.setState({ errors: {} });
		const valid = validate(subdomain, workspaceURL);
		if (valid != null) {
			this.setState({
				errors: valid
			});
		} else {
		}
	}

	render() {
		const { workspaceURL, emailAddress, password, keepSignedIn, loginPending, errors } = this.state;
		const { workspaceURLStatus, clientStyle } = this.props;

		const workspaceURLPending = workspaceURLStatus == null || workspaceURLStatus == REDUX_STATE.PENDING;

		// Handle client specific page styling
		const style = this.clientStyling();

		return (
			<Fragment>
				{(workspaceURLPending || loginPending) && <Loading />}
				<div className={`form-container col-xs-12 col-md-6 col-lg-5 d-flex flex-column hidden-md-down ${style.links}`}>
					<div id="login">
						<div className="p-3 p-sm-5 align-vertical justify-content-center">
							<form className="w-100">
								<div className="w-100 text-center mb-4">
									<span className="logo">{!workspaceURLPending && <img src={(clientStyle && clientStyle.get("logoImage")) || require("../../common/images/logo_small.png")} />}</span>
								</div>
								{workspaceURLStatus == REDUX_STATE.REJECTED && (
									<WorkspaceURL workspaceURL={workspaceURL} changeSubdomain={this.changeSubdomain} changeField={this.changeField} errors={errors} />
								)}
								{workspaceURLStatus != REDUX_STATE.REJECTED && (
									<LoginForm
										emailAddress={emailAddress}
										password={password}
										keepSignedIn={keepSignedIn}
										loginPending={loginPending}
										login={this.login}
										handleChecked={this.handleChecked}
										changeField={this.changeField}
										style={style}
										errors={errors}
									/>
								)}
							</form>
						</div>
					</div>
				</div>
				<div className={`background-container col-md-6 col-lg-7 ${style.background}`} />
			</Fragment>
		);
	}
}

SignIn.propTypes = {
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

export default connect(mapStateToProps, mapDispatchToProps)(SignIn);
