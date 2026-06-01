const test = require("node:test");
const assert = require("node:assert/strict");
const api = require("../test-utils/request");

test("upload endpoint exists and rejects missing image", async () => {
  const response = await api.post("/api/upload/image");

  assert.notEqual(response.statusCode, 404);
  assert.equal(response.statusCode, 400);
  assert.equal(response.body.success, false);
});

test("upload endpoint accepts image and returns disease prediction", async () => {
  const pngHeader = Buffer.from([
    0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a,
  ]);

  const response = await api
    .post("/api/upload/image")
    .field("cropName", "Tomato")
    .field("symptoms", "brown spot and blight")
    .attach("image", pngHeader, {
      filename: "tomato_blight_spot.png",
      contentType: "image/png",
    });

  assert.equal(response.statusCode, 200);
  assert.equal(response.body.success, true);
  assert.ok(response.body.data.prediction.disease);
  assert.ok(response.body.data.report.id);
});
