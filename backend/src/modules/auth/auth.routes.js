const express = require("express");
const {
  completePasswordReset,
  editProfile,
  forgotPassword,
  googleAuth,
  guestAccess,
  login,
  logout,
  me,
  register,
  updatePassword,
} = require("./auth.controller");
const { authenticate } = require("../../middlewares/auth.middleware");
const {
  validateAuthLogin,
  validateAuthRegister,
  validatePasswordReset,
} = require("../../middlewares/validation.middleware");

const router = express.Router();

router.post("/guest", guestAccess);
router.post("/register", validateAuthRegister, register);
router.post("/login", validateAuthLogin, login);
router.post("/google", googleAuth);
router.post("/logout", authenticate, logout);
router.get("/me", authenticate, me);
router.put("/profile", authenticate, editProfile);
router.post("/change-password", authenticate, updatePassword);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", validatePasswordReset, completePasswordReset);

module.exports = router;
