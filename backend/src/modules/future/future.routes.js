const express = require("express");
const { fetchFutureScopes } = require("./future.controller");

const router = express.Router();

router.get("/", fetchFutureScopes);

module.exports = router;
