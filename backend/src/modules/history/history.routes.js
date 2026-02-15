const express = require("express");
const router = express.Router();
const { fetchUserHistory } = require("./history.controller");

router.get("/:userId", fetchUserHistory);

module.exports = router;
