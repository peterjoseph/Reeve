// Async function for handling front-end get, post and patch calls
export default {
	async execute(path, options) {
		const response = await fetch(path, options);

		if (response.status === 200) {
			return;
		}

		throw new Error(response);
	},

	perform(path, options = {}) {
		return this.execute(path, options);
	}
};
