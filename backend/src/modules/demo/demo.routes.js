const express = require("express");
const router = express.Router();
const { runDemoController } = require("./demo.controller");

router.get("/run", runDemoController);

module.exports = router;
