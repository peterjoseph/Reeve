// Account Registration
export function clientRegistration(client) {
	return fetch("/internal/register/", {
		method: "POST",
		headers: {
			"Accept": "application/json",
			"Content-Type": "application/json",
			"Pragma": "no-cache"
		},
		body: JSON.stringify({
			"workspaceURL": client.workspaceURL,
			"firstName": client.firstName,
			"lastName": client.lastName,
			"emailAddress": client.emailAddress,
			"password": client.password
		})
	});
}