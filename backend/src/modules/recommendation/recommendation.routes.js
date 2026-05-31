const express = require("express");
const router = express.Router();

const {
  getDemo,
  postClassifyCrop,
  postRecommend,
  postFertilizer,
} = require("./recommendation.controller");

const {
  validateAdvisory,
  validateFertilizer,
} = require("../../middlewares/validation.middleware");

router.get("/demo", getDemo);
router.post("/recommend", validateAdvisory, postRecommend);
router.post("/classify-crop", postClassifyCrop);
router.post("/fertilizer", validateFertilizer, postFertilizer);

module.exports = router;
