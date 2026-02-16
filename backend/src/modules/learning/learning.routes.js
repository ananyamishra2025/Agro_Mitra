const express = require("express");
const router = express.Router();

const {
  fetchGardeningTips,
  fetchLearningResources
} = require("./learning.controller");

router.get("/gardening", fetchGardeningTips);
router.get("/resources", fetchLearningResources);

module.exports = router;
