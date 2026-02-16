const express = require("express");
const router = express.Router();
const { getGardeningTips } = require("./gardening.controller");

router.get("/", getGardeningTips);

module.exports = router;
