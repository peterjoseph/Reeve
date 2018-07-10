import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet";
import validate from "validate.JS";
import { t } from "shared/translations/i18n";
import { REDUX_STATE } from "shared/constants";
import { extractSubdomain } from "shared/utilities/subdomain";

import { clientStyling } from "./components/ClientStyling";
import { AUTHENTICATION, validateWorkspaceURL, forgotAccount } from "../../common/store/reducers/authentication.js";
import { forgot } from "shared/validation/authentication";

import InputField from "../../common/components/inputs/InputField";

class Forgot extends Component {
	constructor(props) {
		super(props);

		this.state = {
			emailAddress: "",
			loading: false,
			visible: false,
			errors: {}
		};

		this.forgot = this.forgot.bind(this);
		this.changeField = this.changeField.bind(this);
	}

	componentDidMount() {
		// Validate workspace url and retrieve client information
		if (this.props.workspaceURLStatus !== REDUX_STATE.FULFILLED) {
			const subdomain = extractSubdomain(window.location.href);
			this.props.validateWorkspaceURL(subdomain);
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
			errors: {}
		});
		const user = {
			emailAddress: this.state.emailAddress
		};

		// Validate input parameters
		const valid = validate(user, forgot);
		if (valid != null) {
			this.setState({
				loading: false,
				errors: valid
			});
		} else {
			this.props.forgotAccount(user);
		}
	}

	render() {
		const { emailAddress, loading, errors } = this.state;
		const { workspaceURLStatus, clientStyle } = this.props;

		const workspaceURLPending = workspaceURLStatus == null || workspaceURLStatus == REDUX_STATE.PENDING;

		// Handle client specific page styling
		const style = clientStyling(workspaceURLStatus, clientStyle);

		return (
			<Fragment>
				<Helmet>
					<title>{t("headers.forgot.title")}</title>
					<meta name="description" content={t("headers.forgot.description")} />
				</Helmet>
				<div className={`form-container col-xs-12 col-md-6 col-lg-5 d-flex flex-column hidden-md-down ${style.links}`}>
					<div id="forgot">
						<div className="p-3 p-sm-5 align-vertical justify-content-center">
							<form className="w-100">
								<div className="w-100 text-center mt-4 mb-4">
									<span className="logo">{!workspaceURLPending && <img src={(clientStyle && clientStyle.get("logoImage")) || require("distribution/images/logo_small.png")} />}</span>
								</div>
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
									error={errors}
								/>
								<button type="submit" className={`btn btn-primary btn-lg btn-block mt-4 p-3 ${style.button}`} onClick={this.forgot} disabled={loading}>
									{t("action.sendEmail")}
								</button>
								<div className="mt-4">
									{t("components.authentication.existingAccount")} <Link to={{ pathname: "/signin" }}>{t("action.signIn")}</Link>
								</div>
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
	forgotAccount: PropTypes.func,
	validateWorkspaceURL: PropTypes.func,
	workspaceURLStatus: PropTypes.string,
	clientStyle: PropTypes.object
};

function mapStateToProps(state) {
	return {
		workspaceURLStatus: state.getIn([AUTHENTICATION, "workspaceURL", "status"]),
		clientStyle: state.getIn([AUTHENTICATION, "workspaceURL", "payload"])
	};
}

function mapDispatchToProps(dispatch) {
	return {
		forgotAccount: bindActionCreators(forgotAccount, dispatch),
		validateWorkspaceURL: bindActionCreators(validateWorkspaceURL, dispatch)
	};
}

export default connect(mapStateToProps, mapDispatchToProps)(Forgot);
