import { t } from "shared/translations/i18n";
import { RESTRICTED_LANGUAGES, RESTRICTED_DOMAINS } from "shared/constants";

const updateClient = (updateType = "post") => {
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
};

const updateLocalization = (updateType = "post") => {
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
};

const deleteWorkspace = () => {
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
};

module.exports = {
	updateClient: updateClient,
	updateLocalization: updateLocalization,
	deleteWorkspace: deleteWorkspace
};
