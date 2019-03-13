import { t } from "shared/translations/i18n";
import { RESTRICTED_LANGUAGES } from "shared/constants";

const updateUserProfile = () => {
	return {
		firstName: {
			presence: {
				allowEmpty: false
			},
			length: {
				maximum: 255
			}
		},
		lastName: {
			presence: {
				allowEmpty: false
			},
			length: {
				maximum: 255
			}
		},
		emailAddress: {
			email: true,
			presence: {
				allowEmpty: false
			},
			length: {
				maximum: 255
			}
		},
		bio: {
			presence: {
				allowEmpty: true
			},
			length: {
				maximum: 255
			}
		},
		location: {
			presence: {
				allowEmpty: true
			},
			length: {
				maximum: 255
			}
		},
		website: {
			presence: {
				allowEmpty: true
			},
			length: {
				maximum: 255
			}
		},
	};
};

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

const changeSavedLanguage = () => {
	return {
		language: {
			presence: {
				allowEmpty: false
			},
			inclusion: {
				within: RESTRICTED_LANGUAGES
			}
		}
	};
};

module.exports = {
	updateUserProfile: updateUserProfile,
	changeUserPassword: changeUserPassword,
	changeSavedLanguage: changeSavedLanguage
};
