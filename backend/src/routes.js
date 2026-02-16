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

module.exports = router;
