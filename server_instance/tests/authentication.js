const test = require("ava");
const app = require("../server/server.js");
const config = require("../config");
let request = require("supertest");

// Launch Server
const server = app.listen();

// Define default server path
request = request(config.build.publicPath);

/******** AUTHENTICATION TEST CASES ********/

// Workspace URL
// 403 Error Response when missing or incorrect workspace url provided
test("Workspace URL - 403", async t => {
	const response = await request.get("internal/validate_workspace_url/");
	t.is(response.status, 403);
});

// Exit test server on completion
test("Exit Test Server", t => {
	server.close();
	t.pass();
});
