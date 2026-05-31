const express = require("express");
const { fetchSettings, saveSettings } = require("./settings.controller");

const router = express.Router();

router.get("/", fetchSettings);
router.put("/", saveSettings);
router.post("/", saveSettings);

module.exports = router;
