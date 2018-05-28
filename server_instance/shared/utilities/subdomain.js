// Extract a complete subdomain from a href url
function extractSubdomain(href) {
	let regex = /(?:http[s]*\:\/\/)*(.*?)\.(?=[^\/]*\..{2,4})/;

	// Alternative regex for localhost development environments
	if (process.env.NODE_ENV === "development") {
		regex = /(?:http[s]*\:\/\/)*(.*?)\.(?=[^\/]*)/;
	}

	// Determine subdomain using regex
	const projectedDomain = href.match(regex);
	if (projectedDomain && projectedDomain[1]) {
		return projectedDomain[1];
	}
	return "";
}

module.exports = {
	extractSubdomain: extractSubdomain
};
