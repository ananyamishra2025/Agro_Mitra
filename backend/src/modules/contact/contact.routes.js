const express = require("express");
const {
  fetchContactEnquiries,
  submitContactEnquiry,
} = require("./contact.controller");

const router = express.Router();

router.post("/", submitContactEnquiry);
router.get("/", fetchContactEnquiries);

module.exports = router;
