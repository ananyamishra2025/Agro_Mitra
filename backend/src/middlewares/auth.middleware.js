const { errorResponse } = require("../utils/response");
const {
  getProfile,
  isTokenRevoked,
  verifyToken,
} = require("../modules/auth/auth.service");

const authenticate = async (req, res, next) => {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;

  if (!token) {
    return errorResponse(res, "Authentication token is required", 401);
  }

  if (await isTokenRevoked(token)) {
    return errorResponse(res, "Session has been logged out", 401);
  }

  try {
    const payload = verifyToken(token);
    req.authToken = token;
    req.user = await getProfile(payload.sub);
    return next();
  } catch (error) {
    return errorResponse(res, "Invalid or expired token", 401);
  }
};

const authorizeRoles = (...roles) => (req, res, next) => {
  if (!req.user || !roles.includes(req.user.role)) {
    return errorResponse(res, "You do not have permission for this action", 403);
  }

  return next();
};

module.exports = { authenticate, authorizeRoles };
