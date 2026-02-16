const express = require("express");
const router = express.Router();

const {
  getDemo,
  postRecommend,
  postFertilizer,
} = require("./recommendation.controller");

const {
  validateAdvisory,
  validateFertilizer
} = require("../../middlewares/validation.middleware");

// 🔥 One-click Demo (no validation needed)
router.get("/demo", getDemo);

// 🔥 Weather-based Recommendation with validation
router.post("/recommend", validateAdvisory, postRecommend);

// 🔥 Fertilizer Calculator with validation
router.post("/fertilizer", validateFertilizer, postFertilizer);

module.exports = router;
