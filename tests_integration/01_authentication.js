const test = require("ava");
const uniqid = require("uniqid");
const app = require("../server/server.js");
const config = require("../config");

let request = require("supertest");

// Launch Server
const server = app.listen();

// Define default server path
request = request(config.build.publicPath);

// Generate unique global test data
let testData = {
	workspaceURL: `testworkspace${uniqid()}`,
	firstName: "John",
	lastName: "Demo",
	emailAddress: `test-account-${uniqid()}@getreeve.com`,
	password: uniqid(),
	privacyConsent: true,
	language: "en",
	securityToken: null
};
module.exports = testData;

// 403 - Create new client account
test("Create New Client - Missing Body Content - 403 Response", async t => {
	const response = await request.post("api/v1.0/authentication/register");
	t.is(response.status, 403);
	t.deepEqual(response.body.reason.emailAddress, ["Error: Field cannot be blank."]);
	t.deepEqual(response.body.reason.password, ["Error: Field cannot be blank."]);
	t.deepEqual(response.body.reason.workspaceURL, ["Error: Field cannot be blank."]);
});

// 200 - Create new client account
test("Create New Client - Valid Body - 200 Response", async t => {
	const response = await request.post("api/v1.0/authentication/register").send({
		workspaceURL: testData.workspaceURL,
		firstName: testData.firstName,
		lastName: testData.lastName,
		emailAddress: testData.emailAddress,
		password: testData.password,
		privacyConsent: testData.privacyConsent,
		language: testData.language
	});
	t.is(response.status, 200);
});

// 403 - Create new client account, workspace url already used
test("Create New Client - Duplicate body content - 403 Response", async t => {
	const response = await request.post("api/v1.0/authentication/register").send({
		workspaceURL: testData.workspaceURL,
		firstName: testData.firstName,
		lastName: testData.lastName,
		emailAddress: testData.emailAddress,
		password: testData.password,
		privacyConsent: testData.privacyConsent,
		language: testData.language
	});
	t.is(response.status, 403);
	t.deepEqual(response.body.reason.workspaceURL, ["Sorry, this workspace name has already been used."]);
});

// 403 - Missing or incorrect Workspace URL provided
test("Authenticate Workspace URL - Missing Header - 403 Response", async t => {
	const response = await request.get("api/v1.0/authentication/validate-workspace-url");
	t.is(response.status, 403);
});

// 200 - Valid Workspace URL supplied
test("Authenticate Workspace URL - Valid Header - 200 Response", async t => {
	const response = await request.get("api/v1.0/authentication/validate-workspace-url").set("workspaceurl", testData.workspaceURL);
	t.is(response.status, 200);
	t.is(response.body.style.defaultLanguage, "en");
});

// 200 - Login to User Account (Client Owner)
test("Owner Account Login - Valid Body - 200 Response", async t => {
	const response = await request.post("api/v1.0/authentication/login").send({
		workspaceURL: testData.workspaceURL,
		emailAddress: testData.emailAddress,
		password: testData.password,
		keepSignedIn: false
	});
	t.is(response.status, 200);
	t.not(response.body.token, null);
	t.is(response.body.keepSignedIn, false);

	// Store token for future user
	testData.securityToken = `jwt ${response.body.token}`;
});

// 200 - Login to User Account with Security Token (Client Owner)
test("Owner Account Security Token Login - Valid Body - 200 Response", async t => {
	const response = await request
		.post("api/v1.0/authentication/login")
		.set("Authorization", testData.securityToken)
		.send({
			authToken: true
		});
	t.is(response.status, 200);
});

// 403 - Login to User Account failure with invalid Security Token (Client Owner)
test("Owner Account Invalid Security Token Login Failure - Invalid Token - 403 Response", async t => {
	const response = await request
		.post("api/v1.0/authentication/login")
		.set("Authorization", "invalid security token")
		.send({
			authToken: true
		});
	t.is(response.status, 403);
});

// 200 - Load User (Client Owner)
test("Load User Account - Valid Body - 200 Response", async t => {
	const response = await request.get("api/v1.0/authentication/load-user").set("Authorization", testData.securityToken);
	t.is(response.status, 200);
	t.is(response.body.user.firstName, testData.firstName);
	t.is(response.body.user.lastName, testData.lastName);
	t.is(response.body.user.emailAddress, testData.emailAddress);
	t.is(response.body.user.workspaceURL, testData.workspaceURL);
	t.not(response.body.user.clientFeatures, null);
	t.not(response.body.user.userRoles, null);
	t.is(response.body.user.language, testData.language);
});

// 200 - Logout of active user account (Client Owner)
test("Owner Account Logout - Valid Header - 200 Response", async t => {
	const response = await request.post("api/v1.0/authentication/logout").set("Authorization", testData.securityToken);
	t.is(response.status, 200);
});

// Cleanup test server on completion
test.after("Cleanup test environment", t => {
	server.close();
});
