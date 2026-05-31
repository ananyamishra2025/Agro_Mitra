const { successResponse } = require("../../utils/response");
const { listActivities } = require("./activity.service");

const getActivities = async (req, res) => {
  const userId = req.user?.id || req.params.userId || "demoUser";
  const activities = await listActivities(userId);
  return successResponse(res, { activities }, "Activity logs fetched successfully");
};

module.exports = { getActivities };
