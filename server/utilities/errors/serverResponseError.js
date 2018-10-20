export function ServerResponseError(status, message, reason) {
	this.name = "ServerResponseError";
	this.status = status || 500;
	this.message = message || "";
	this.reason = reason || "";
}

ServerResponseError.prototype = Error.prototype;
