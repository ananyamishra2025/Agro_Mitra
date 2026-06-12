const { successResponse, errorResponse } = require("../../utils/response");
const { getDashboardOverview } = require("./dashboard.service");

const fetchDashboardOverview = async (req, res) => {
  try {
    const userId = req.user?.id || req.query.userId || "demoUser";
    const overview = await getDashboardOverview(userId);
    return successResponse(res, overview, "Dashboard overview fetched successfully");
  } catch (error) {
    console.error("Dashboard overview error:", error.message);
    return errorResponse(res, "Failed to fetch dashboard overview");
  }
};

module.exports = { fetchDashboardOverview };
