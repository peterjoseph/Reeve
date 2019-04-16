import { t } from "shared/translations/i18n";
import { RESTRICTED_LANGUAGES, RESTRICTED_DOMAINS } from "shared/constants";

export function login() {
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
				maximum: 66
			}
		}
	};
}

export function register() {
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
		password: {
			presence: {
				allowEmpty: false
			},
			length: {
				minimum: 6,
				maximum: 66,
				message: t("validation.validators.invalidPasswordLength")
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
		},
		privacyConsent: {
			presence: {
				allowEmpty: false,
				isBoolean: true
			},
			exclusion: {
				within: [false],
				message: t("validation.validators.missingConsent")
			}
		},
		language: {
			presence: {
				allowEmpty: false
			},
			inclusion: {
				within: RESTRICTED_LANGUAGES
			}
		}
	};
}

export function workspaceURL() {
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
				minimum: 4,
				maximum: 255
			}
		}
	};
}

export function forgot() {
	return {
		emailAddress: {
			email: true,
			presence: {
				allowEmpty: false
			},
			length: {
				maximum: 255
			}
		}
	};
}

export function verifyResetPassword() {
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
}

export function resetPassword() {
	return {
		password: {
			presence: {
				allowEmpty: false
			},
			length: {
				minimum: 6,
				maximum: 66,
				message: t("validation.validators.invalidPasswordLength")
			}
		},
		verifyPassword: {
			presence: {
				allowEmpty: false
			},
			length: {
				minimum: 6,
				maximum: 66,
				message: t("validation.validators.invalidPasswordLength")
			},
			equality: {
				attribute: "password",
				comparator: function(v1, v2) {
					return JSON.stringify(v1) === JSON.stringify(v2);
				}
			}
		},
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
}

export function verifyEmail() {
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
}
