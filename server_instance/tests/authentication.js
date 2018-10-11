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
test("Authenticate Workspace URL - Missing Header - 403 Response", async t => {
	const response = await request.get("internal/validate_workspace_url/");
	t.is(response.status, 403);
});

// Cleanup test server on completion
test.after("Cleanup test environment", t => {
	server.close();
});
