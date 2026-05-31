const express = require("express");
const router = express.Router();

// 📘 API Documentation Route (Root /api)
router.get("/", (req, res) => {
  res.json({
    project: "Agro-Mitra",
    version: "1.0",
    description: "Smart Agriculture Assistance Backend API",
    endpoints: [
      "GET    /api",
      "POST   /api/advisory",
      "POST   /api/chatbot/ask",
      "POST   /api/voice/ask",
      "GET    /api/history/:userId",
      "GET    /api/dashboard/overview",
      "POST   /api/contact",
      "GET    /api/contact",
      "GET    /api/settings",
      "POST   /api/settings",
      "GET    /api/future",
      "POST   /api/auth/register",
      "POST   /api/auth/login",
      "POST   /api/auth/google",
      "POST   /api/auth/logout",
      "GET    /api/auth/me",
      "PUT    /api/auth/profile",
      "POST   /api/auth/forgot-password",
      "POST   /api/auth/reset-password",
      "GET    /api/admin/overview",
      "GET    /api/admin/users",
      "GET    /api/saved/queries/:userId",
      "POST   /api/saved/queries",
      "GET    /api/saved/reports/:userId",
      "POST   /api/saved/reports",
      "GET    /api/activity/:userId",
      "GET    /api/demo/run",
      "POST   /api/upload/image",
      "GET    /api/gardening",
      "GET    /api/learning/resources",
      "GET    /api/learning/gardening"
    ]
  });
});

// ================= MODULE ROUTES =================

const advisoryRoutes = require("./modules/advisory/advisory.routes");
const authRoutes = require("./modules/auth/auth.routes");
const recommendationRoutes = require("./modules/recommendation/recommendation.routes");
const uploadRoutes = require("./modules/upload/upload.routes");
const chatbotRoutes = require("./modules/chatbot/chatbot.routes");
const voiceRoutes = require("./modules/voice/voice.routes");
const historyRoutes = require("./modules/history/history.routes");
const demoRoutes = require("./modules/demo/demo.routes");
const gardeningRoutes = require("./modules/gardening/gardening.routes");
const learningRoutes = require("./modules/learning/learning.routes");
const dashboardRoutes = require("./modules/dashboard/dashboard.routes");
const contactRoutes = require("./modules/contact/contact.routes");
const settingsRoutes = require("./modules/settings/settings.routes");
const futureRoutes = require("./modules/future/future.routes");
const adminRoutes = require("./modules/admin/admin.routes");
const savedRoutes = require("./modules/saved/saved.routes");
const activityRoutes = require("./modules/activity/activity.routes");

// Register all routes
router.use("/advisory", advisoryRoutes);
router.use("/auth", authRoutes);
router.use("/", recommendationRoutes);
router.use("/upload", uploadRoutes);
router.use("/chatbot", chatbotRoutes);
router.use("/voice", voiceRoutes);
router.use("/history", historyRoutes);
router.use("/demo", demoRoutes);
router.use("/gardening", gardeningRoutes);
router.use("/learning", learningRoutes);
router.use("/dashboard", dashboardRoutes);
router.use("/contact", contactRoutes);
router.use("/settings", settingsRoutes);
router.use("/future", futureRoutes);
router.use("/admin", adminRoutes);
router.use("/saved", savedRoutes);
router.use("/activity", activityRoutes);

module.exports = router;
