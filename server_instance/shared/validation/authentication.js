const login = {
	workspaceURL: {
		presence: {
			allowEmpty: false
		}
	},
	emailAddress: {
		presence: {
			allowEmpty: false
		}
	},
	password: {
		presence: {
			allowEmpty: false
		}
	}
};

const register = {
	firstName: {
		presence: {
			allowEmpty: false
		}
	},
	lastName: {
		presence: {
			allowEmpty: false
		}
	},
	emailAddress: {
		presence: {
			allowEmpty: false
		}
	},
	password: {
		presence: {
			allowEmpty: false
		}
	},
	workspaceURL: {
		presence: {
			allowEmpty: false
		}
	}
};

module.exports = {
	login: login,
	register: register
};