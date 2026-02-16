const express = require("express");
const router = express.Router();

const upload = require("./upload.service"); // your multer config
const { uploadImage } = require("./upload.controller");

router.post(
  "/image",
  upload.single("image"),
  uploadImage
);

module.exports = router;
