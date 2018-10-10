// Set NODE_ENV to "development" because AVA changes it to "test" which breaks Webpack
process.env.NODE_ENV = "development";

// Import AVA
const test = require("ava");

// connect to the server
const app = require("../server/server.js");

// create a new session using supertest
const request = require("supertest").agent(app.listen());

test("example", async t => {
	const response = await request(request).get("/status");
	t.is(response.status, 200);
	t.deepEqual(response.body, {
		status: "Ok"
	});
});
