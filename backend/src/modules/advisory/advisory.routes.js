const express = require("express");
const router = express.Router();

const { getAdvisory } = require("./advisory.controller");

router.post("/recommend", getAdvisory);

module.exports = router;
