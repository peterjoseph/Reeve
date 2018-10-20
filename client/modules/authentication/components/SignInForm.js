import React, { Component } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { t } from "shared/translations/i18n";

import SuccessNotification from "common/components/SuccessNotification";
import ServerSuccess from "common/components/ServerSuccess";
import ServerError from "common/components/ServerError";
import InputField from "common/components/inputs/InputField";
import Checkbox from "common/components/inputs/Checkbox";

class SignInForm extends Component {
	render() {
		const { emailAddress, password, loginPending, workspaceURLPending, keepSignedIn, login, changeField, handleChecked, style, serverError, validationErrors } = this.props;

		const showSuccessMsg = !loginPending && !serverError && !validationErrors;

		return (
			<div>
				<div className="w-100 mb-3">
					<span className="h3">{t("action.signIn")}</span>
				</div>
				{showSuccessMsg && <SuccessNotification path={{ reset: "success" }} message={t("success.resetPassword")} />}
				{showSuccessMsg && <ServerSuccess path={{ registration: "success" }} message={t("success.clientRegistration")} />}
				<ServerError error={serverError} />
				<InputField
					label={t("label.emailAddress")}
					name="emailAddress"
					id={"email-input"}
					value={emailAddress}
					type={"textField"}
					ariaLabel={"emailAddress"}
					onChange={changeField}
					disabled={loginPending || workspaceURLPending}
					error={validationErrors}
				/>
				<InputField
					label={t("label.password")}
					name="password"
					id={"password-input"}
					value={password}
					type={"password"}
					ariaLabel={t("label.password")}
					onChange={changeField}
					disabled={loginPending || workspaceURLPending}
					error={validationErrors}
				/>
				<div className="form-row pl-1 pr-1">
					<div className="col">
						<Checkbox
							id="signedInCheck"
							name="keepSignedIn"
							value={keepSignedIn}
							onClick={handleChecked}
							disabled={loginPending || workspaceURLPending}
							label={t("components.authentication.keepSignedIn")}
						/>
					</div>
					<div className="col text-right">
						<Link to={{ pathname: "/forgot" }}>{t("components.authentication.forgotPassword")}</Link>
					</div>
				</div>
				<button type="submit" className={`btn btn-primary btn-lg btn-block mt-4 p-3 ${style.button}`} onClick={login} disabled={loginPending || workspaceURLPending}>
					{t("action.signIn")}
				</button>
				<div className="mt-4">
					<span>{t("components.authentication.noAccount")}</span> <Link to={{ pathname: "/register" }}>{t("action.register")}</Link>
				</div>
			</div>
		);
	}
}

SignInForm.propTypes = {
	history: PropTypes.object,
	emailAddress: PropTypes.string,
	password: PropTypes.string,
	loginPending: PropTypes.bool,
	workspaceURLPending: PropTypes.bool,
	keepSignedIn: PropTypes.bool,
	login: PropTypes.func,
	handleChecked: PropTypes.func,
	changeField: PropTypes.func,
	style: PropTypes.object,
	validationErrors: PropTypes.object,
	serverError: PropTypes.object
};

export default SignInForm;
