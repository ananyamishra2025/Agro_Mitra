const express = require("express");
const multer = require("multer");
const { voiceChat } = require("./voice.controller");

const router = express.Router();
const upload = multer({ dest: "uploads/audio" });

router.post("/chat", upload.single("audio"), voiceChat);

module.exports = router;
