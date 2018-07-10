import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet";
import validate from "validate.JS";
import { t } from "shared/translations/i18n";

import { forgotAccount } from "../../common/store/reducers/authentication.js";
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
		return (
			<Fragment>
				<Helmet>
					<title>{t("headers.forgot.title")}</title>
					<meta name="description" content={t("headers.forgot.description")} />
				</Helmet>
				<div className="form-container col-xs-12 col-md-6 col-lg-5 d-flex flex-column hidden-md-down">
					<div id="forgot">
						<div className="p-3 p-sm-5 align-vertical justify-content-center">
							<form className="w-100">
								<div className="w-100 text-center mt-4 mb-4">
									<span>
										<img src={require("../../common/images/logo_small.png")} />
									</span>
								</div>
								<div className="w-100 mt-3 mb-3">
									<span className="h3"> {t("label.accountDetails")} </span>
								</div>
								<div className="mt-4 mb-4">
									<span>
										<strong>{t("components.authentication.forgotAccountDetails.header")}</strong>
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
								<button type="submit" className="btn btn-primary btn-lg btn-block mt-4 p-3" onClick={this.forgot} disabled={loading}>
									{t("action.sendEmail")}
								</button>
								<div className="mt-4">
									{t("components.authentication.existingAccount")} <Link to={{ pathname: "/signin" }}>{t("action.signIn")}</Link>
								</div>
							</form>
						</div>
					</div>
				</div>
				<div className="background-container col-md-6 col-lg-7" />
			</Fragment>
		);
	}
}

Forgot.propTypes = {
	forgotAccount: PropTypes.func
};

function mapStateToProps(state) {
	return {};
}

function mapDispatchToProps(dispatch) {
	return {
		forgotAccount: bindActionCreators(forgotAccount, dispatch)
	};
}

export default connect(mapStateToProps, mapDispatchToProps)(Forgot);
