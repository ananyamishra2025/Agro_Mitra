const express = require("express");
const router = express.Router();

router.post("/guest", (req, res) => {
  res.json({ message: "Guest access granted" });
});

module.exports = router;
