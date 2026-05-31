const ActivityLog = require("./activity-log.model");
const { isDatabaseConnected } = require("../../utils/database");

const memoryLogs = [];

const normalizeActivity = (activity) => ({
  id: activity.id || activity._id?.toString(),
  userId: activity.userId,
  action: activity.action,
  entityType: activity.entityType,
  entityId: activity.entityId,
  message: activity.message,
  meta: activity.meta || {},
  createdAt: activity.createdAt,
});

const logActivity = async ({ userId = "demoUser", action, entityType = "", entityId = "", message, meta = {} }) => {
  if (!action || !message) return null;

  if (isDatabaseConnected()) {
    const activity = await ActivityLog.create({
      userId,
      action,
      entityType,
      entityId,
      message,
      meta,
    });

    return normalizeActivity(activity);
  }

  const activity = {
    id: `activity_${Date.now()}`,
    userId,
    action,
    entityType,
    entityId,
    message,
    meta,
    createdAt: new Date().toISOString(),
  };
  memoryLogs.unshift(activity);
  return activity;
};

const listActivities = async (userId = "demoUser", limit = 25) => {
  if (isDatabaseConnected()) {
    const rows = await ActivityLog.find({ userId }).sort({ createdAt: -1 }).limit(limit);
    return rows.map(normalizeActivity);
  }

  return memoryLogs.filter((activity) => activity.userId === userId).slice(0, limit);
};

module.exports = { listActivities, logActivity };
