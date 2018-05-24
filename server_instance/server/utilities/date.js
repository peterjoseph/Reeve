// Generate a date in MySQL dateTime format
function generateDate() {
	return new Date().toISOString().slice(0, 19).replace("T", " ");
}

module.exports = {
	generateDate: generateDate
};
