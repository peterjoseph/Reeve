const test = require("ava");
const app = require("../server/server.js");
const config = require("../config");
const path = require("path");
const SequelizeMock = require("sequelize-mock");

let request = require("supertest");

// Create Sequelize DB Mock
let dbMock = new SequelizeMock();

// Override DB Models
dbMock.$overrideImport(path.join(__dirname, "../server/models/client.js"), path.join(__dirname, "../server/tests/mocks/client.js"));

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
