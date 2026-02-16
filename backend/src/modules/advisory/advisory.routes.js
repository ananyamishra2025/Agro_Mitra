const express = require("express");
const router = express.Router();

const { getAdvisory } = require("./advisory.controller");
const { validateAdvisory } = require("../../middlewares/validation.middleware");

// 🔥 Advisory Recommendation Route with Validation
router.post("/recommend", validateAdvisory, getAdvisory);

module.exports = router;
