import queryString from "query-string";

// Takes a url and object to generate a query string
export function generateQueryStringURL(path, parameters) {
	// Check there is no forward slash at end of string
	if (path.slice(-1) === "/") {
		path = path.substring(0, path.length - 1);
	}

	// Generate query string from parameters
	const query = queryString.stringify(parameters);
	return `${path}${query ? "?" + query : "/"}`;
}
