import { t } from "shared/translations/i18n";
import { RESTRICTED_LANGUAGES, RESTRICTED_DOMAINS } from "shared/constants";

const updateUserProfile = (updateType = "post") => {
	// Check if patching is enabled
	const required = updateType == "patch" ? false : true;

	return {
		firstName: {
			presence: required,
			noEmptyValue: true,
			length: {
				maximum: 255
			}
		},
		lastName: {
			presence: required,
			noEmptyValue: true,
			length: {
				maximum: 255
			}
		},
		emailAddress: {
			email: true,
			presence: required,
			noEmptyValue: true,
			length: {
				maximum: 255
			}
		},
		bio: {
			presence: required,
			noEmptyValue: false,
			length: {
				maximum: 255
			}
		},
		location: {
			presence: required,
			noEmptyValue: false,
			length: {
				maximum: 255
			}
		},
		website: {
			presence: required,
			noEmptyValue: false,
			length: {
				maximum: 255
			}
		}
	};
};

const verifyEmail = () => {
	return {
		code: {
			presence: {
				allowEmpty: false
			},
			length: {
				maximum: 255
			}
		},
		workspaceURL: {
			presence: {
				allowEmpty: false
			},
			format: {
				pattern: "[a-z0-9]+",
				flags: "i",
				message: t("validation.validators.validCharactersAZ09")
			},
			exclusion: {
				within: RESTRICTED_DOMAINS,
				message: t("validation.validators.validWorkspaceURL")
			},
			length: {
				minimum: 4,
				maximum: 255
			}
		}
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
	verifyEmail: verifyEmail,
	changeUserPassword: changeUserPassword,
	changeSavedLanguage: changeSavedLanguage
};
