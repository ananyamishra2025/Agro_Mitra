const { successResponse, errorResponse } = require("../../utils/response");
const { getDemoUser, loginUser, registerUser } = require("./auth.service");

const guestAccess = (req, res) => {
  return successResponse(res, { user: getDemoUser() }, "Guest access granted");
};

const register = (req, res) => {
  try {
    const user = registerUser(req.body);
    return successResponse(res, { user }, "Account created successfully", 201);
  } catch (error) {
    return errorResponse(res, error.message, 400);
  }
};

const login = (req, res) => {
  try {
    const user = loginUser(req.body);
    return successResponse(res, { user }, "Logged in successfully");
  } catch (error) {
    return errorResponse(res, error.message, 401);
  }
};

const googleAuth = (req, res) => {
  try {
    const user = loginUser({ ...req.body, provider: "google" });
    return successResponse(res, { user }, "Google account connected successfully");
  } catch (error) {
    return errorResponse(res, error.message, 400);
  }
};

module.exports = { googleAuth, guestAccess, login, register };
