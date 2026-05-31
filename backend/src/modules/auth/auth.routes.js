const express = require("express");
const {
  googleAuth,
  guestAccess,
  login,
  register,
} = require("./auth.controller");

const router = express.Router();

router.post("/guest", guestAccess);
router.post("/register", register);
router.post("/login", login);
router.post("/google", googleAuth);

module.exports = router;
