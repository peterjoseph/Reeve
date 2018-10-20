// Generate a date in MySQL dateTime format
export function generateDate() {
	return new Date()
		.toISOString()
		.slice(0, 19)
		.replace("T", " ");
}
