const assert = require("node:assert/strict");
const http = require("node:http");
const test = require("node:test");

const request = (app, { method = "GET", path = "/", body, headers = {} } = {}) => new Promise((resolve, reject) => {
  const server = app.listen(0, () => {
    const { port } = server.address();
    const payload = body ? JSON.stringify(body) : undefined;
    const req = http.request(
      {
        hostname: "127.0.0.1",
        port,
        path,
        method,
        headers: {
          ...(payload
            ? {
                "Content-Type": "application/json",
                "Content-Length": Buffer.byteLength(payload)
              }
            : {}),
          ...headers
        }
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
  delete process.env.GROQ_API_KEY;
  delete process.env.OPENWEATHER_API_KEY;

  const app = require("../src/app");
  const response = await request(app, { path: "/" });

  assert.equal(response.statusCode, 200);
  assert.equal(response.body.status, "OK");
});

test("chatbot route returns rule-based answers without Groq credentials", async () => {
  delete process.env.GROQ_API_KEY;

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

test("dashboard overview serves frontend stats", async () => {
  const app = require("../src/app");
  const response = await request(app, { path: "/api/dashboard/overview" });

  assert.equal(response.statusCode, 200);
  assert.equal(response.body.success, true);
  assert.equal(response.body.data.user.name, "Ananya Mishra");
  assert.equal(typeof response.body.data.stats.totalQueries, "number");
});

test("contact route accepts enquiries", async () => {
  const app = require("../src/app");
  const response = await request(app, {
    method: "POST",
    path: "/api/contact",
    body: {
      name: "Test User",
      contact: "test@example.com",
      message: "Need crop advisory help"
    }
  });

  assert.equal(response.statusCode, 201);
  assert.equal(response.body.success, true);
  assert.equal(response.body.data.status, "new");
});

test("settings route returns user preferences", async () => {
  const app = require("../src/app");
  const response = await request(app, { path: "/api/settings" });

  assert.equal(response.statusCode, 200);
  assert.equal(response.body.success, true);
  assert.equal(response.body.data.profile.name, "Ananya Mishra");
});

test("future route returns planned features", async () => {
  const app = require("../src/app");
  const response = await request(app, { path: "/api/future" });

  assert.equal(response.statusCode, 200);
  assert.equal(response.body.success, true);
  assert.ok(response.body.data.features.length >= 4);
});

test("auth register creates frontend account profile", async () => {
  const app = require("../src/app");
  const response = await request(app, {
    method: "POST",
    path: "/api/auth/register",
    body: {
      name: "Ananya Mishra",
      email: "ananya@example.com",
      password: "secret"
    }
  });

  assert.equal(response.statusCode, 201);
  assert.equal(response.body.success, true);
  assert.equal(response.body.data.user.name, "Ananya Mishra");
  assert.ok(response.body.data.token);
});

test("auth change password updates registered account", async () => {
  const app = require("../src/app");

  const registered = await request(app, {
    method: "POST",
    path: "/api/auth/register",
    body: {
      name: "Password User",
      email: "password@example.com",
      password: "old-secret"
    }
  });

  const response = await request(app, {
    method: "POST",
    path: "/api/auth/change-password",
    headers: {
      Authorization: `Bearer ${registered.body.data.token}`
    },
    body: {
      currentPassword: "old-secret",
      newPassword: "new-secret"
    }
  });

  assert.equal(response.statusCode, 200);
  assert.equal(response.body.success, true);
  assert.equal(response.body.data.user.email, "password@example.com");
});

test("auth profile and logout use JWT", async () => {
  const app = require("../src/app");
  const registered = await request(app, {
    method: "POST",
    path: "/api/auth/register",
    body: {
      name: "Profile User",
      email: "profile@example.com",
      password: "secret"
    }
  });

  const token = registered.body.data.token;
  const profile = await request(app, {
    path: "/api/auth/me",
    headers: { Authorization: `Bearer ${token}` }
  });

  assert.equal(profile.statusCode, 200);
  assert.equal(profile.body.data.user.email, "profile@example.com");

  const logout = await request(app, {
    method: "POST",
    path: "/api/auth/logout",
    headers: { Authorization: `Bearer ${token}` }
  });

  assert.equal(logout.statusCode, 200);

  const afterLogout = await request(app, {
    path: "/api/auth/me",
    headers: { Authorization: `Bearer ${token}` }
  });

  assert.equal(afterLogout.statusCode, 401);
});

test("password reset flow updates password", async () => {
  const app = require("../src/app");
  await request(app, {
    method: "POST",
    path: "/api/auth/register",
    body: {
      name: "Reset User",
      email: "reset@example.com",
      password: "old-secret"
    }
  });

  const forgot = await request(app, {
    method: "POST",
    path: "/api/auth/forgot-password",
    body: { email: "reset@example.com" }
  });

  assert.equal(forgot.statusCode, 200);
  assert.ok(forgot.body.data.resetToken);

  const reset = await request(app, {
    method: "POST",
    path: "/api/auth/reset-password",
    body: {
      token: forgot.body.data.resetToken,
      newPassword: "new-secret"
    }
  });

  assert.equal(reset.statusCode, 200);
});

test("admin routes support user management", async () => {
  const app = require("../src/app");
  const login = await request(app, {
    method: "POST",
    path: "/api/auth/login",
    body: {
      email: "admin@agromitra.in",
      password: "admin123"
    }
  });

  const token = login.body.data.token;
  const overview = await request(app, {
    path: "/api/admin/overview",
    headers: { Authorization: `Bearer ${token}` }
  });

  assert.equal(overview.statusCode, 200);
  assert.equal(overview.body.success, true);

  const users = await request(app, {
    path: "/api/admin/users",
    headers: { Authorization: `Bearer ${token}` }
  });

  assert.equal(users.statusCode, 200);
  assert.ok(users.body.data.users.length >= 1);
});

test("database models are registered for required collections", async () => {
  const mongoose = require("mongoose");

  require("../src/modules/auth/user.model");
  require("../src/modules/auth/auth-token.model");
  require("../src/modules/history/history.model");
  require("../src/modules/contact/contact.model");
  require("../src/modules/upload/crop-disease.model");
  require("../src/modules/learning/learning-resource.model");
  require("../src/modules/advisory/weather-cache.model");
  require("../src/modules/saved/saved-query.model");
  require("../src/modules/saved/saved-report.model");
  require("../src/modules/activity/activity-log.model");

  const modelNames = mongoose.modelNames();

  assert.ok(modelNames.includes("User"));
  assert.ok(modelNames.includes("AuthToken"));
  assert.ok(modelNames.includes("History"));
  assert.ok(modelNames.includes("Contact"));
  assert.ok(modelNames.includes("CropDisease"));
  assert.ok(modelNames.includes("LearningResource"));
  assert.ok(modelNames.includes("WeatherCache"));
  assert.ok(modelNames.includes("SavedQuery"));
  assert.ok(modelNames.includes("SavedReport"));
  assert.ok(modelNames.includes("ActivityLog"));
});
