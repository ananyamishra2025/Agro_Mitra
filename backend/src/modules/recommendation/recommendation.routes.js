const express = require("express");
const router = express.Router();

const {
  getDemo,
  postRecommend,
  postFertilizer,
} = require("./recommendation.controller");

router.get("/demo", getDemo);
router.post("/recommend", postRecommend);
router.post("/fertilizer", postFertilizer);

module.exports = router;