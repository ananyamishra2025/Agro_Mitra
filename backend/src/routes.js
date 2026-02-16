const express = require("express");
const router = express.Router();

const advisoryRoutes = require("./modules/advisory/advisory.routes");
const authRoutes = require("./modules/auth/auth.routes");
const recommendationRoutes = require("./modules/recommendation/recommendation.routes");
const uploadRoutes = require("./modules/upload/upload.routes");
//Chatbot module
const chatbotRoutes = require("./modules/chatbot/chatbot.routes");
const voiceRoutes = require("./modules/voice/voice.routes");
const historyRoutes = require("./modules/history/history.routes");
const demoRoutes = require("./modules/demo/demo.routes");
const learningRoutes = require("./modules/learning/learning.routes");

router.use("/advisory", advisoryRoutes);
router.use("/auth", authRoutes);
router.use("/", recommendationRoutes);
router.use("/upload", uploadRoutes);
// 🤖 Chatbot route
router.use("/chatbot", chatbotRoutes);
router.use("/voice", voiceRoutes);
router.use("/history", historyRoutes);
router.use("/demo", demoRoutes);
router.use("/learning", learningRoutes);

module.exports = router;