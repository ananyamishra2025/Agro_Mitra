const assert = require("node:assert/strict");
const http = require("node:http");
const test = require("node:test");

const request = (app, { method = "GET", path = "/", body } = {}) => new Promise((resolve, reject) => {
  const server = app.listen(0, () => {
    const { port } = server.address();
    const payload = body ? JSON.stringify(body) : undefined;
    const req = http.request(
      {
        hostname: "127.0.0.1",
        port,
        path,
        method,
        headers: payload
          ? {
              "Content-Type": "application/json",
              "Content-Length": Buffer.byteLength(payload)
            }
          : {}
      },
      (res) => {
        let data = "";
        res.setEncoding("utf8");
        res.on("data", chunk => { data += chunk; });
        res.on("end", () => {
          server.close(() => {
            resolve({
              statusCode: res.statusCode,
              body: data ? JSON.parse(data) : null
            });
          });
        });
      }
    );

    req.on("error", (error) => {
      server.close(() => reject(error));
    });

    if (payload) {
      req.write(payload);
    }

    req.end();
  });
});

test("app imports and serves health check without optional API keys", async () => {
  delete process.env.OPENAI_API_KEY;
  delete process.env.OPENWEATHER_API_KEY;

  const app = require("../src/app");
  const response = await request(app, { path: "/" });

  assert.equal(response.statusCode, 200);
  assert.equal(response.body.status, "OK");
});

test("chatbot route returns rule-based answers without OpenAI credentials", async () => {
  delete process.env.OPENAI_API_KEY;

  const app = require("../src/app");
  const response = await request(app, {
    method: "POST",
    path: "/api/chatbot/ask",
    body: { question: "Why are my crop leaves yellow?" }
  });

  assert.equal(response.statusCode, 200);
  assert.equal(response.body.success, true);
  assert.match(response.body.data.answer, /Yellow leaves/i);
});

test("history route does not hang when MongoDB is disconnected", async () => {
  const app = require("../src/app");
  const response = await request(app, { path: "/api/history/demoUser" });

  assert.equal(response.statusCode, 200);
  assert.equal(response.body.success, true);
  assert.equal(response.body.data.count, 0);
  assert.deepEqual(response.body.data.history, []);
});