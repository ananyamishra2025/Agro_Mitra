const express = require("express");
const router = express.Router();

const advisoryRoutes = require("./modules/advisory/advisory.routes");
const authRoutes = require("./modules/auth/auth.routes");
const uploadRoutes = require("./modules/upload/upload.routes");

router.use("/advisory", advisoryRoutes);
router.use("/auth", authRoutes);
router.use("/upload", uploadRoutes);

module.exports = router;
