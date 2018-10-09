import test from "ava";
const request = require("supertest");
const server = require("../server/server.js");

test("example", async t => {
	const response = await request(server).get("/status");
	t.is(response.status, 200);
	t.deepEqual(response.body, {
		status: "Ok"
	});
});
