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
              headers: res.headers,
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

const multipartRequest = (
  app,
  {
    path,
    fields = {},
    fileField,
    fileName,
    fileContent,
    mimeType = "application/octet-stream",
  }
) => new Promise((resolve, reject) => {
  const boundary = `----agromitra-test-${Date.now()}`;
  const chunks = [];

  Object.entries(fields).forEach(([name, value]) => {
    chunks.push(Buffer.from(`--${boundary}\r\n`));
    chunks.push(Buffer.from(`Content-Disposition: form-data; name="${name}"\r\n\r\n`));
    chunks.push(Buffer.from(`${value}\r\n`));
  });

  if (fileField) {
    chunks.push(Buffer.from(`--${boundary}\r\n`));
    chunks.push(Buffer.from(
      `Content-Disposition: form-data; name="${fileField}"; filename="${fileName}"\r\n`
    ));
    chunks.push(Buffer.from(`Content-Type: ${mimeType}\r\n\r\n`));
    chunks.push(Buffer.isBuffer(fileContent) ? fileContent : Buffer.from(fileContent || ""));
    chunks.push(Buffer.from("\r\n"));
  }

  chunks.push(Buffer.from(`--${boundary}--\r\n`));
  const payload = Buffer.concat(chunks);

  const server = app.listen(0, () => {
    const { port } = server.address();
    const req = http.request(
      {
        hostname: "127.0.0.1",
        port,
        path,
        method: "POST",
        headers: {
          "Content-Type": `multipart/form-data; boundary=${boundary}`,
          "Content-Length": payload.length,
        },
      },
      (res) => {
        let data = "";
        res.setEncoding("utf8");
        res.on("data", chunk => { data += chunk; });
        res.on("end", () => {
          server.close(() => {
            resolve({
              statusCode: res.statusCode,
              headers: res.headers,
              body: data ? JSON.parse(data) : null,
            });
          });
        });
      }
    );

    req.on("error", (error) => {
      server.close(() => reject(error));
    });

    req.write(payload);
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

test("profile endpoint supports fetching and editing authenticated user profile", async () => {
  const app = require("../src/app");
  const registered = await request(app, {
    method: "POST",
    path: "/api/auth/register",
    body: {
      name: "Editable Profile",
      email: "editable-profile@example.com",
      password: "secret123",
    },
  });

  const token = registered.body.data.token;
  const updated = await request(app, {
    method: "PUT",
    path: "/api/auth/profile",
    headers: { Authorization: `Bearer ${token}` },
    body: {
      name: "Ananya Mishra",
      phone: "9876543210",
      profile: {
        location: "Kolkata, West Bengal",
        farmType: "Vegetable farm",
        preferredLanguage: "English",
      },
    },
  });

  assert.equal(updated.statusCode, 200);
  assert.equal(updated.body.success, true);
  assert.equal(updated.body.data.user.name, "Ananya Mishra");
  assert.equal(updated.body.data.user.profile.location, "Kolkata, West Bengal");

  const profile = await request(app, {
    path: "/api/auth/me",
    headers: { Authorization: `Bearer ${token}` },
  });

  assert.equal(profile.statusCode, 200);
  assert.equal(profile.body.data.user.phone, "9876543210");
});

test("JWT middleware rejects missing and malformed tokens", async () => {
  const app = require("../src/app");

  const missing = await request(app, { path: "/api/auth/me" });
  assert.equal(missing.statusCode, 401);
  assert.equal(missing.body.success, false);

  const malformed = await request(app, {
    path: "/api/auth/me",
    headers: { Authorization: "Bearer not-a-real-token" },
  });
  assert.equal(malformed.statusCode, 401);
  assert.equal(malformed.body.success, false);
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

test("database-backed services fall back safely when MongoDB is disconnected", async () => {
  const mongoose = require("mongoose");
  const { createContactEnquiry, listContactEnquiries } = require("../src/modules/contact/contact.service");
  const { logActivity, listActivities } = require("../src/modules/activity/activity.service");
  const { saveQuery, listSavedQueries, saveReport, listSavedReports } = require("../src/modules/saved/saved.service");

  assert.notEqual(mongoose.connection.readyState, 1);

  const contact = await createContactEnquiry({
    name: "Database Test",
    contact: "db-test@example.com",
    message: "Testing fallback persistence",
  });
  assert.equal(contact.status, "new");

  const activity = await logActivity({
    userId: "databaseTestUser",
    action: "test_activity",
    message: "Database fallback activity",
  });
  assert.equal(activity.userId, "databaseTestUser");

  const query = await saveQuery({
    userId: "databaseTestUser",
    feature: "chatbot",
    title: "Saved test query",
    query: { question: "Best crop?" },
    result: { answer: "Wheat" },
  });
  assert.equal(query.feature, "chatbot");

  const report = await saveReport({
    userId: "databaseTestUser",
    reportType: "crop_advisory",
    title: "Saved test report",
    data: { crop: "Wheat" },
  });
  assert.equal(report.reportType, "crop_advisory");

  assert.ok((await listContactEnquiries()).length >= 1);
  assert.equal((await listActivities("databaseTestUser")).length, 1);
  assert.equal((await listSavedQueries("databaseTestUser")).length, 1);
  assert.equal((await listSavedReports("databaseTestUser")).length, 1);
});

test("crop classification returns scored crop matches", async () => {
  const app = require("../src/app");
  const response = await request(app, {
    method: "POST",
    path: "/api/classify-crop",
    body: {
      season: "rabi",
      soilType: "loamy",
      temperature: 22,
      rainfall: 60,
      irrigation: "moderate",
    },
  });

  assert.equal(response.statusCode, 200);
  assert.equal(response.body.success, true);
  assert.ok(response.body.data.crops.length > 0);
  assert.equal(typeof response.body.data.crops[0].confidence, "number");
});

test("recommendation engine returns crops, fertilizer, and action plan", async () => {
  const app = require("../src/app");
  const response = await request(app, {
    method: "POST",
    path: "/api/recommend",
    body: {
      location: "Kolkata",
      season: "rabi",
      soilType: "loamy",
      landSize: 2,
      budget: 8000,
      temperature: 24,
      rainfall: 55,
    },
  });

  assert.equal(response.statusCode, 200);
  assert.equal(response.body.success, true);
  assert.ok(response.body.data.recommendedCrops.length > 0);
  assert.ok(response.body.data.fertilizer_plan.length > 0);
  assert.ok(response.body.data.actionPlan.length > 0);
});

test("disease detection model classifies image evidence", () => {
  const { detectDisease } = require("../src/modules/ai/disease-detection.service");
  const result = detectDisease({
    fileName: "tomato_leaf_blight_spot.jpg",
    cropName: "Tomato",
    symptoms: "brown spots and yellowing",
  });

  assert.match(result.disease, /Blight|Spot|Nitrogen/i);
  assert.ok(result.confidenceScore > 35);
  assert.ok(result.advice.length > 0);
});

test("upload image route processes crop disease reports", async () => {
  const app = require("../src/app");
  const pngHeader = Buffer.from([
    0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a,
    0x00, 0x00, 0x00, 0x0d,
  ]);

  const response = await multipartRequest(app, {
    path: "/api/upload/image",
    fields: {
      cropName: "Tomato",
      symptoms: "brown spot and blight",
    },
    fileField: "image",
    fileName: "tomato_blight_spot.png",
    fileContent: pngHeader,
    mimeType: "image/png",
  });

  assert.equal(response.statusCode, 200);
  assert.equal(response.body.success, true);
  assert.ok(response.body.data.prediction.disease);
  assert.ok(response.body.data.report.id);
});

test("upload image route rejects missing image file", async () => {
  const app = require("../src/app");
  const response = await request(app, {
    method: "POST",
    path: "/api/upload/image",
    body: { cropName: "Tomato" },
  });

  assert.equal(response.statusCode, 400);
  assert.equal(response.body.success, false);
});

test("voice route validates language and requires audio file", async () => {
  const app = require("../src/app");

  const invalidLanguage = await request(app, {
    method: "POST",
    path: "/api/voice/ask",
    body: { language: "fr-FR" },
  });

  assert.equal(invalidLanguage.statusCode, 400);
  assert.equal(invalidLanguage.body.success, false);

  const missingAudio = await request(app, {
    method: "POST",
    path: "/api/voice/ask",
    body: { language: "hi-IN" },
  });

  assert.equal(missingAudio.statusCode, 400);
  assert.equal(missingAudio.body.success, false);
});

test("security middleware applies Helmet and rate-limit headers", async () => {
  const app = require("../src/app");
  const response = await request(app, { path: "/" });

  assert.equal(response.statusCode, 200);
  assert.equal(response.headers["x-dns-prefetch-control"], "off");
  assert.ok(response.headers["ratelimit-limit"]);
});

test("auth validation rejects weak registration payloads", async () => {
  const app = require("../src/app");
  const response = await request(app, {
    method: "POST",
    path: "/api/auth/register",
    body: {
      name: "A",
      email: "not-an-email",
      password: "123",
    },
  });

  assert.equal(response.statusCode, 400);
  assert.equal(response.body.success, false);
});
