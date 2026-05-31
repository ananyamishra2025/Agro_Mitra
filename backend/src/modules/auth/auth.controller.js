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

const register = async (req, res) => {
  try {
    const auth = await registerUser(req.body);
    return successResponse(res, auth, "Account created successfully", 201);
  } catch (error) {
    return errorResponse(res, error.message, 400);
  }
};

const login = async (req, res) => {
  try {
    const auth = await loginUser(req.body);
    return successResponse(res, auth, "Logged in successfully");
  } catch (error) {
    return errorResponse(res, error.message, 401);
  }
};

const googleAuth = async (req, res) => {
  try {
    const auth = await loginUser({ ...req.body, provider: "google" });
    return successResponse(res, auth, "Google account connected successfully");
  } catch (error) {
    return errorResponse(res, error.message, 400);
  }
};

const logout = async (req, res) => {
  return successResponse(res, await logoutUser(req.authToken), "Logged out successfully");
};

const me = async (req, res) => {
  return successResponse(res, { user: await getProfile(req.user.id) }, "Profile fetched successfully");
};

const editProfile = async (req, res) => {
  try {
    const user = await updateProfile(req.user.id, req.body);
    return successResponse(res, { user }, "Profile updated successfully");
  } catch (error) {
    return errorResponse(res, error.message, 400);
  }
};

const updatePassword = async (req, res) => {
  try {
    const userId = req.user?.id;
    const user = await changePassword({ ...req.body, userId });
    return successResponse(res, { user }, "Password changed successfully");
  } catch (error) {
    return errorResponse(res, error.message, 400);
  }
};

const forgotPassword = async (req, res) => {
  try {
    const reset = await createPasswordReset(req.body);
    return successResponse(res, reset, "Password reset token generated successfully");
  } catch (error) {
    return errorResponse(res, error.message, 400);
  }
};

const completePasswordReset = async (req, res) => {
  try {
    const user = await resetPassword(req.body);
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
