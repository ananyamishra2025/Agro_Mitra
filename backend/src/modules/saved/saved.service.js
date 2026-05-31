const SavedQuery = require("./saved-query.model");
const SavedReport = require("./saved-report.model");
const { isDatabaseConnected } = require("../../utils/database");

const memoryQueries = [];
const memoryReports = [];

const normalize = (record) => ({
  id: record.id || record._id?.toString(),
  ...(record.toObject?.() || record),
});

const saveQuery = async ({ userId = "demoUser", feature, title, query, result = {}, pinned = false }) => {
  if (isDatabaseConnected()) {
    const saved = await SavedQuery.create({ userId, feature, title, query, result, pinned });
    return normalize(saved);
  }

  const saved = {
    id: `query_${Date.now()}`,
    userId,
    feature,
    title,
    query,
    result,
    pinned,
    createdAt: new Date().toISOString(),
  };
  memoryQueries.unshift(saved);
  return saved;
};

const listSavedQueries = async (userId = "demoUser") => {
  if (isDatabaseConnected()) {
    const rows = await SavedQuery.find({ userId }).sort({ pinned: -1, createdAt: -1 });
    return rows.map(normalize);
  }

  return memoryQueries.filter((query) => query.userId === userId);
};

const saveReport = async ({ userId = "demoUser", reportType, title, summary = "", data, status = "saved" }) => {
  if (isDatabaseConnected()) {
    const saved = await SavedReport.create({ userId, reportType, title, summary, data, status });
    return normalize(saved);
  }

  const saved = {
    id: `report_${Date.now()}`,
    userId,
    reportType,
    title,
    summary,
    data,
    status,
    createdAt: new Date().toISOString(),
  };
  memoryReports.unshift(saved);
  return saved;
};

const listSavedReports = async (userId = "demoUser") => {
  if (isDatabaseConnected()) {
    const rows = await SavedReport.find({ userId }).sort({ createdAt: -1 });
    return rows.map(normalize);
  }

  return memoryReports.filter((report) => report.userId === userId);
};

module.exports = { listSavedQueries, listSavedReports, saveQuery, saveReport };
