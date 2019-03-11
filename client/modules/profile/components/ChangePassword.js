import React, { Component } from "react";
import PropTypes from "prop-types";

import { t } from "shared/translations/i18n";

import User from "common/components/User";
import InputField from "common/components/inputs/InputField";

class ChangePassword extends Component {
	constructor(props) {
		super(props);

		this.state = {
			currentPassword: "",
			newPassword: "",
			confirmPassword: ""
		};

		this.changeField = this.changeField.bind(this);
	}

	changeField(evt) {
		this.setState({ [evt.target.name]: evt.target.value });
	}

	render() {
		const { currentPassword, newPassword, confirmPassword } = this.state;

		return (
			<div>
				<InputField
					label={t("components.profile.currentPassword")}
					name={"currentPassword"}
					id={"currentPassword"}
					value={currentPassword}
					type={"password"}
					ariaLabel={t("components.profile.currentPassword")}
					onChange={this.changeField}
					required
					disabled={false}
					error={null}
				/>
				<InputField
					label={t("components.profile.newPassword")}
					name={"newPassword"}
					id={"newPassword"}
					value={newPassword}
					type={"password"}
					ariaLabel={t("components.profile.newPassword")}
					onChange={this.changeField}
					required
					disabled={false}
					error={null}
				/>
				<InputField
					label={t("components.profile.confirmNewPassword")}
					name={"confirmPassword"}
					id={"confirmPassword"}
					value={confirmPassword}
					type={"password"}
					ariaLabel={t("components.profile.confirmNewPassword")}
					onChange={this.changeField}
					required
					disabled={false}
					error={null}
				/>
				<button type="submit" className={"btn btn-primary btn-sm btn-block mt-4 p-3"} disabled={false}>
					{t("components.profile.changePassword")}
				</button>
			</div>
		);
	}
}

ChangePassword.propTypes = {
	user: PropTypes.object
};

export default User(ChangePassword);
