import { t } from "shared/translations/i18n";
import { RESTRICTED_LANGUAGES, RESTRICTED_DOMAINS } from "shared/constants";

const login = () => {
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
};

const register = () => {
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
};

const workspaceURL = () => {
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
};

const forgot = () => {
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
};

const verifyResetPassword = () => {
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

const resetPassword = () => {
	return {
		password: {
			presence: {
				allowEmpty: false
			},
			length: {
				minimum: 6,
				maximum: 66
			}
		},
		verifyPassword: {
			presence: {
				allowEmpty: false
			},
			length: {
				minimum: 6,
				maximum: 66
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

module.exports = {
	login: login,
	register: register,
	workspaceURL: workspaceURL,
	forgot: forgot,
	verifyResetPassword: verifyResetPassword,
	resetPassword: resetPassword,
	verifyEmail: verifyEmail
};
