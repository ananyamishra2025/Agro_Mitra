const express = require("express");
const router = express.Router();
const multer = require("multer");
const { processVoiceQuestion } = require("./voice.controller");
const { validateVoice } = require("../../middlewares/validation.middleware");

const upload = multer({ dest: "uploads/audio/" });

router.post(
  "/ask",
  validateVoice,
  upload.single("audio"),
  processVoiceQuestion
);

module.exports = router;
