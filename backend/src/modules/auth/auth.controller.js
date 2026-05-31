const { successResponse, errorResponse } = require("../../utils/response");
const {
  changePassword,
  createPasswordReset,
  getDemoUser,
  getProfile,
  loginUser,
  logoutUser,
  registerUser,
  resetPassword,
  updateProfile,
} = require("./auth.service");

const guestAccess = (req, res) => {
  return successResponse(res, { user: getDemoUser() }, "Guest access granted");
};

const register = (req, res) => {
  try {
    const auth = registerUser(req.body);
    return successResponse(res, auth, "Account created successfully", 201);
  } catch (error) {
    return errorResponse(res, error.message, 400);
  }
};

const login = (req, res) => {
  try {
    const auth = loginUser(req.body);
    return successResponse(res, auth, "Logged in successfully");
  } catch (error) {
    return errorResponse(res, error.message, 401);
  }
};

const googleAuth = (req, res) => {
  try {
    const auth = loginUser({ ...req.body, provider: "google" });
    return successResponse(res, auth, "Google account connected successfully");
  } catch (error) {
    return errorResponse(res, error.message, 400);
  }
};

const logout = (req, res) => {
  return successResponse(res, logoutUser(req.authToken), "Logged out successfully");
};

const me = (req, res) => {
  return successResponse(res, { user: getProfile(req.user.id) }, "Profile fetched successfully");
};

const editProfile = (req, res) => {
  try {
    const user = updateProfile(req.user.id, req.body);
    return successResponse(res, { user }, "Profile updated successfully");
  } catch (error) {
    return errorResponse(res, error.message, 400);
  }
};

const updatePassword = (req, res) => {
  try {
    const userId = req.user?.id;
    const user = changePassword({ ...req.body, userId });
    return successResponse(res, { user }, "Password changed successfully");
  } catch (error) {
    return errorResponse(res, error.message, 400);
  }
};

const forgotPassword = (req, res) => {
  try {
    const reset = createPasswordReset(req.body);
    return successResponse(res, reset, "Password reset token generated successfully");
  } catch (error) {
    return errorResponse(res, error.message, 400);
  }
};

const completePasswordReset = (req, res) => {
  try {
    const user = resetPassword(req.body);
    return successResponse(res, { user }, "Password reset successfully");
  } catch (error) {
    return errorResponse(res, error.message, 400);
  }
};

module.exports = {
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
};
