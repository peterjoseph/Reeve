const test = require("ava");
const app = require("../server/server.js");
const config = require("../config");

let request = require("supertest");

// Launch Server
const server = app.listen();

// Define default server path
request = request(config.build.publicPath);

/******** WORKSPACE URL TEST CASES ********/

// 403 - Missing or incorrect Workspace URL provided
test("Authenticate Workspace URL - Missing Header - 403 Response", async t => {
	const response = await request.get("internal/validate_workspace_url/");
	t.is(response.status, 403);
});

// 200 - Valid Workspace URL supplied
test("Authenticate Workspace URL - Valid Header - 200 Response", async t => {
	const response = await request.get("internal/validate_workspace_url/").set("workspaceurl", "test");
	t.is(response.status, 200);
});

// Cleanup test server on completion
test.after("Cleanup test environment", t => {
	server.close();
});
