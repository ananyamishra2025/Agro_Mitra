const test = require("node:test");
const assert = require("node:assert/strict");
const api = require("../test-utils/request");

test("protected route rejects missing token", async () => {
  const response = await api.get("/api/auth/me");

  assert.equal(response.statusCode, 401);
  assert.equal(response.body.success, false);
});

test("protected route rejects invalid token", async () => {
  const response = await api
    .get("/api/auth/me")
    .set("Authorization", "Bearer invalidtoken");

  assert.equal(response.statusCode, 401);
  assert.equal(response.body.success, false);
});

test("logout revokes JWT access", async () => {
  const registered = await api
    .post("/api/auth/register")
    .send({
      name: "JWT Test User",
      email: `jwt-${Date.now()}@example.com`,
      password: "secret123",
    })
    .expect(201);

  const token = registered.body.data.token;

  await api
    .post("/api/auth/logout")
    .set("Authorization", `Bearer ${token}`)
    .expect(200);

  const response = await api
    .get("/api/auth/me")
    .set("Authorization", `Bearer ${token}`);

  assert.equal(response.statusCode, 401);
});
