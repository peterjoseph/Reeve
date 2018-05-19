import { t } from "~/shared/translations/i18n";

const restrictedDomains = ["domain", "account", "accounts", "admin", "registration", "signup", "configuration", "web", "mobile", "app", "software", "com", "net", "org"];

const login = {
	workspaceURL: {
		presence: {
			allowEmpty: false
		},
		format: {
			pattern: "[a-z0-9]+",
			flags: "i",
			message: t("validation.validCharactersAZ09")
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
	password: {
		presence: {
			allowEmpty: false
		},
		length: {
			maximum: 255
		}
	}
};

const register = {
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
	password: {
		presence: {
			allowEmpty: false
		},
		length: {
			minimum: 6
		}
	},
	workspaceURL: {
		presence: {
			allowEmpty: false
		},
		format: {
			pattern: "[a-z0-9]+",
			flags: "i",
			message: t("validation.validCharactersAZ09")
		},
		exclusion: {
			within: restrictedDomains,
			message: "^Sorry, you cannot use the WorkspaceURL %{value}"
		},
		length: {
			minimum: 4,
			maximum: 255
		}
	}
};

module.exports = {
	login: login,
	register: register
};
