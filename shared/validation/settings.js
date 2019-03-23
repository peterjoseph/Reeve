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

module.exports = {
	updateClient: updateClient
};
