import { t } from "shared/translations/i18n";

const changeUserPassword = () => {
	return {
		currentPassword: {
			presence: {
				allowEmpty: false
			},
			length: {
				minimum: 6,
				maximum: 66,
				message: t("validation.validators.invalidPasswordLength")
			}
		},
		newPassword: {
			presence: {
				allowEmpty: false
			},
			length: {
				minimum: 6,
				maximum: 66,
				message: t("validation.validators.invalidPasswordLength")
			}
		},
		confirmPassword: {
			presence: {
				allowEmpty: false
			},
			length: {
				minimum: 6,
				maximum: 66,
				message: t("validation.validators.invalidPasswordLength")
			},
			equality: {
				attribute: "newPassword",
				comparator: function(v1, v2) {
					return JSON.stringify(v1) === JSON.stringify(v2);
				},
				message: t("validation.validators.unmatchedPasswords")
			}
		}
	};
};

module.exports = {
	changeUserPassword: changeUserPassword
};
