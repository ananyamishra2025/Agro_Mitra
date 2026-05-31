const express = require("express");
const {
  createSavedQuery,
  createSavedReport,
  getSavedQueries,
  getSavedReports,
} = require("./saved.controller");
const { authenticate } = require("../../middlewares/auth.middleware");

const router = express.Router();

router.get("/queries/:userId?", getSavedQueries);
router.post("/queries", authenticate, createSavedQuery);
router.get("/reports/:userId?", getSavedReports);
router.post("/reports", authenticate, createSavedReport);

module.exports = router;
