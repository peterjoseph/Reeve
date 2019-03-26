import { RESTRICTED_LANGUAGES } from "shared/constants";

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

module.exports = {
	updateClient: updateClient,
	updateLocalization: updateLocalization
};
