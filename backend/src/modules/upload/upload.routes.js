const express = require("express");
const router = express.Router();

const upload = require("./upload.service");

router.post(
  "/image",
  upload.single("image"),
  (req, res) => {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No image uploaded",
      });
    }

    res.json({
      success: true,
      message: "Image uploaded successfully",
      imageUrl: `/uploads/images/${req.file.filename}`,
    });
  }
);

module.exports = router;