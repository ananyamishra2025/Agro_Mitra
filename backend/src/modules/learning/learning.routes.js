const express = require("express");
const router = express.Router();
const { getLearningResources } = require("./learning.controller");

router.get("/resources", getLearningResources);

module.exports = router;
