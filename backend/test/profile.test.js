const test = require("node:test");
const assert = require("node:assert/strict");
const api = require("../test-utils/request");

test("profile route returns authenticated user profile", async () => {
  const email = `profile-${Date.now()}@example.com`;
  const registered = await api
    .post("/api/auth/register")
    .send({
      name: "Profile Test User",
      email,
      password: "secret123",
    })
    .expect(201);

  const response = await api
    .get("/api/auth/me")
    .set("Authorization", `Bearer ${registered.body.data.token}`);

  assert.equal(response.statusCode, 200);
  assert.equal(response.body.success, true);
  assert.equal(response.body.data.user.email, email);
});

test("profile route updates user profile", async () => {
  const registered = await api
    .post("/api/auth/register")
    .send({
      name: "Profile Edit User",
      email: `profile-edit-${Date.now()}@example.com`,
      password: "secret123",
    })
    .expect(201);

  const response = await api
    .put("/api/auth/profile")
    .set("Authorization", `Bearer ${registered.body.data.token}`)
    .send({
      name: "Ananya Mishra",
      profile: {
        location: "Kolkata, West Bengal",
        farmType: "Vegetable farm",
      },
    });

  assert.equal(response.statusCode, 200);
  assert.equal(response.body.data.user.name, "Ananya Mishra");
  assert.equal(response.body.data.user.profile.location, "Kolkata, West Bengal");
});
