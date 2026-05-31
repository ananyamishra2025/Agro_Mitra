const { successResponse, errorResponse } = require("../../utils/response");
const {
  listSavedQueries,
  listSavedReports,
  saveQuery,
  saveReport,
} = require("./saved.service");

const getSavedQueries = async (req, res) => {
  const userId = req.user?.id || req.params.userId || "demoUser";
  return successResponse(res, { queries: await listSavedQueries(userId) }, "Saved queries fetched successfully");
};

const createSavedQuery = async (req, res) => {
  try {
    const userId = req.user?.id || "demoUser";
    const query = await saveQuery({ ...req.body, userId });
    return successResponse(res, query, "Query saved successfully", 201);
  } catch (error) {
    return errorResponse(res, error.message, 400);
  }
};

const getSavedReports = async (req, res) => {
  const userId = req.user?.id || req.params.userId || "demoUser";
  return successResponse(res, { reports: await listSavedReports(userId) }, "Saved reports fetched successfully");
};

const createSavedReport = async (req, res) => {
  try {
    const userId = req.user?.id || "demoUser";
    const report = await saveReport({ ...req.body, userId });
    return successResponse(res, report, "Report saved successfully", 201);
  } catch (error) {
    return errorResponse(res, error.message, 400);
  }
};

module.exports = {
  createSavedQuery,
  createSavedReport,
  getSavedQueries,
  getSavedReports,
};
