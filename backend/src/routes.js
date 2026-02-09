const express = require("express");
const router = express.Router();

const advisoryRoutes = require("./modules/advisory/advisory.routes");
const authRoutes = require("./modules/auth/auth.routes");
const recommendationRoutes = require("./modules/recommendation/recommendation.routes");
const uploadRoutes = require("./modules/upload/upload.routes");
//Chatbot module
const chatbotRoutes = require("./modules/chatbot/chatbot.routes");

router.use("/advisory", advisoryRoutes);
router.use("/auth", authRoutes);
router.use("/", recommendationRoutes);
router.use("/upload", uploadRoutes);
// 🤖 Chatbot route
router.use("/chatbot", chatbotRoutes);

module.exports = router;