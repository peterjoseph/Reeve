import validatejs from "validate.js";
import { t } from "shared/translations/i18n";

function validate(body, constraints, options = {}) {
	let validate = validatejs;

	validate.options = { fullMessages: false };

	// Overwrite default validator.js translation strings to ensure internationalization
	validate.validators.date.options = {
		message: t("validation.validators.validDate")
	};
	validate.validators.datetime.options = {
		message: t("validation.validators.validDate")
	};
	validate.validators.email.options = {
		message: t("validation.validators.invalidEmail")
	};
	validate.validators.equality.options = {
		message: t("validation.validators.notEqual")
	};
	validate.validators.exclusion.options = {
		message: t("validation.validators.restricted")
	};
	validate.validators.format.options = {
		message: t("validation.validators.invalid")
	};
	validate.validators.inclusion.options = {
		message: t("validation.validators.notIncluded")
	};
	validate.validators.length.options = {
		message: t("validation.validators.invalid")
	};
	validate.validators.numericality.options = {
		message: t("validation.validators.invalid")
	};
	validate.validators.presence.options = {
		message: t("validation.validators.cannotBeBlank")
	};
	validate.validators.url.options = {
		message: t("validation.validators.invalidURL")
	};

	return validate(body, constraints, options);
}

export default validate;
