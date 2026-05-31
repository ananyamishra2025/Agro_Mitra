const express = require("express");
const { fetchDashboardOverview } = require("./dashboard.controller");

const router = express.Router();

router.get("/overview", fetchDashboardOverview);

module.exports = router;
