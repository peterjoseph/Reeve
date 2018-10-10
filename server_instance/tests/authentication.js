const test = require("ava");
const app = require("../server/server.js");
const server = app.listen();
const request = require("supertest").agent(server);

test("Status Check", t => {
	const response = request.get("/status");
	t.is(response.status, 200);
});

// Exit test server on completion
test("Exit Test Server", t => {
	server.close();
	t.pass();
});
