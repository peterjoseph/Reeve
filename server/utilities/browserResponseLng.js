import { LANGUAGE_CODES, RESTRICTED_LANGUAGES } from "shared/constants";

// Load accept-language from req header and validate for accuracy
export default function(req) {
	if (RESTRICTED_LANGUAGES.includes(req.headers["accept-language"])) {
		return req.headers["accept-language"];
	}
	return LANGUAGE_CODES[1];
}
