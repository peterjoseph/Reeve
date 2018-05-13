const login = {
	workspaceURL: {
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
		length: {
			maximum: 255
		}
	}
};

module.exports = {
	login: login,
	register: register
};