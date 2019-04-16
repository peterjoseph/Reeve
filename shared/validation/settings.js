import { t } from "shared/translations/i18n";
import { RESTRICTED_LANGUAGES, RESTRICTED_DOMAINS } from "shared/constants";

export function updateClient(updateType = "post") {
	// Check if patching is enabled
	const required = updateType == "patch" ? false : true;

	return {
		name: {
			presence: required,
			noEmptyValue: true,
			length: {
				maximum: 255
			}
		},
		description: {
			presence: required,
			noEmptyValue: false,
			length: {
				maximum: 255
			}
		}
	};
}

export function updateLocalization(updateType = "post") {
	// Check if patching is enabled
	const required = updateType == "patch" ? false : true;

	return {
		defaultLanguage: {
			presence: required,
			noEmptyValue: true,
			inclusion: {
				within: RESTRICTED_LANGUAGES
			}
		}
	};
}

export function updateClientStyling(updateType = "post") {
	// Check if patching is enabled
	const required = updateType == "patch" ? false : true;

	return {
		logoImage: {
			presence: required,
			format: {
				pattern: "^$|[0-9]*_[0-9]*_[0-9]*.[a-z]+$",
				flags: "i",
				message: t("validation.validators.validKey")
			}
		},
		backgroundImage: {
			presence: required,
			format: {
				pattern: "^$|[0-9]*_[0-9]*_[0-9]*.[a-z]+$",
				flags: "i",
				message: t("validation.validators.validKey")
			}
		},
		backgroundColor: {
			presence: required,
			noEmptyValue: true,
			format: {
				pattern: "^#[0-9A-F]{6}$",
				flags: "i",
				message: t("validation.validators.validHex")
			}
		},
		primaryColor: {
			presence: required,
			noEmptyValue: true,
			format: {
				pattern: "^#[0-9A-F]{6}$",
				flags: "i",
				message: t("validation.validators.validHex")
			}
		},
		secondaryColor: {
			presence: required,
			noEmptyValue: true,
			format: {
				pattern: "^#[0-9A-F]{6}$",
				flags: "i",
				message: t("validation.validators.validHex")
			}
		}
	};
}

export function deleteWorkspace() {
	return {
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
				maximum: 255
			}
		},
		accountPassword: {
			presence: {
				allowEmpty: false
			},
			length: {
				minimum: 6,
				maximum: 66,
				message: t("validation.validators.invalidPasswordLength")
			}
		}
	};
}
