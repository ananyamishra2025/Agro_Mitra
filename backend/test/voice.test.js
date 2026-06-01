const test = require("node:test");
const assert = require("node:assert/strict");
const api = require("../test-utils/request");

test("voice endpoint responds and rejects missing audio", async () => {
  const response = await api
    .post("/api/voice/ask")
    .send({ language: "hi-IN" });

  assert.notEqual(response.statusCode, 404);
  assert.equal(response.statusCode, 400);
  assert.equal(response.body.success, false);
});

test("voice endpoint validates supported languages", async () => {
  const response = await api
    .post("/api/voice/ask")
    .send({ language: "fr-FR" });

  assert.equal(response.statusCode, 400);
  assert.equal(response.body.success, false);
});
