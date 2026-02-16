const express = require("express");
const router = express.Router();

const { askQuestion } = require("./chatbot.controller");
const { validateChatbot } = require("../../middlewares/validation.middleware");

router.post("/ask", validateChatbot, askQuestion);

module.exports = router;
