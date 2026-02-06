const express = require("express");
const router = express.Router();

const { getAdvisory } = require("./advisory.controller");

router.post("/", getAdvisory);

module.exports = router;
