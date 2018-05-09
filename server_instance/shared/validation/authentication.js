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

};

module.exports = {
	login: login,
	register: register
};