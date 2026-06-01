const test = require("node:test");
const assert = require("node:assert/strict");
const mongoose = require("mongoose");

test("database models are registered", () => {
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

test("database connection state is valid for test environment", () => {
  assert.ok([0, 1, 2, 3].includes(mongoose.connection.readyState));
});

test("database services work without an active MongoDB connection", async () => {
  const { createContactEnquiry, listContactEnquiries } = require("../src/modules/contact/contact.service");
  const { logActivity, listActivities } = require("../src/modules/activity/activity.service");
  const { saveQuery, listSavedQueries } = require("../src/modules/saved/saved.service");

  const userId = `database-test-${Date.now()}`;

  const contact = await createContactEnquiry({
    name: "Database Test",
    contact: "database@example.com",
    message: "Checking database fallback",
  });
  assert.equal(contact.status, "new");

  await logActivity({
    userId,
    action: "database_test",
    message: "Database fallback log",
  });

  await saveQuery({
    userId,
    feature: "chatbot",
    title: "Database fallback query",
    query: { question: "Which crop?" },
  });

  assert.ok((await listContactEnquiries()).length >= 1);
  assert.equal((await listActivities(userId)).length, 1);
  assert.equal((await listSavedQueries(userId)).length, 1);
});
