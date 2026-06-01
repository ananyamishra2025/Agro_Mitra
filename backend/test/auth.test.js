const test = require("node:test");
const assert = require("node:assert/strict");
const api = require("../test-utils/request");

test("auth register creates a user and returns JWT", async () => {
  const response = await api
    .post("/api/auth/register")
    .send({
      name: "Auth Test User",
      email: `auth-${Date.now()}@example.com`,
      password: "secret123",
    });

  assert.equal(response.statusCode, 201);
  assert.equal(response.body.success, true);
  assert.ok(response.body.data.user);
  assert.ok(response.body.data.token);
});

test("auth login works for a registered user", async () => {
  const email = `login-${Date.now()}@example.com`;
  const password = "secret123";

  await api
    .post("/api/auth/register")
    .send({
      name: "Login Test User",
      email,
      password,
    })
    .expect(201);

  const response = await api
    .post("/api/auth/login")
    .send({ email, password });

  assert.equal(response.statusCode, 200);
  assert.equal(response.body.success, true);
  assert.equal(response.body.data.user.email, email);
  assert.ok(response.body.data.token);
});
