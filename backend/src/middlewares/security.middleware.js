const helmet = require("helmet");
const rateLimit = require("express-rate-limit");

const { rateLimitOptions } = require("../config/security");

const securityHeaders = helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" },
});

const apiRateLimiter = rateLimit(rateLimitOptions);

module.exports = { apiRateLimiter, securityHeaders };
