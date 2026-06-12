const { getUserHistory } = require("../history/history.service");
const { listActivities } = require("../activity/activity.service");

const TYPE_LABELS = {
  advisory: "Crop advisory",
  chatbot: "AI chatbot",
  voice: "Voice query",
  image: "Image diagnosis",
  demo: "Demo",
};

const safeJson = (value) => {
  if (typeof value !== "string") return value || {};

  try {
    return JSON.parse(value);
  } catch {
    return {};
  }
};

const asDate = (value) => {
  const date = value ? new Date(value) : null;
  return date && !Number.isNaN(date.getTime()) ? date : null;
};

const getHistoryTitle = (item) => {
  const input = safeJson(item.input);
  const output = safeJson(item.output);

  if (item.type === "advisory") {
    const location = input.location;
    const crop = output.recommendedCrops?.[0] || output.recommended_crops?.[0];
    if (crop) return `Crop advisory for ${crop}`;
    if (location) return `Crop advisory for ${location}`;
  }

  if (item.type === "image") {
    const disease = typeof item.output === "string" ? item.output : output.disease;
    return disease ? `${disease} detected` : "Crop image analyzed";
  }

  if (item.type === "chatbot") {
    return item.input ? `Chatbot: ${String(item.input).slice(0, 72)}` : "Farming question answered";
  }

  if (item.type === "voice") {
    return item.input ? `Voice: ${String(item.input).slice(0, 72)}` : "Voice query processed";
  }

  return `${TYPE_LABELS[item.type] || "Agro-Mitra"} activity`;
};

const activityType = (activity) => {
  const action = activity.action || "";
  if (action.includes("advisory")) return "advisory";
  if (action.includes("disease") || action.includes("image")) return "image";
  if (action.includes("voice")) return "voice";
  if (action.includes("chatbot")) return "chatbot";
  return "activity";
};

const startOfWeek = (date) => {
  const result = new Date(date);
  const day = result.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  result.setDate(result.getDate() + diff);
  result.setHours(0, 0, 0, 0);
  return result;
};

const percentageChange = (current, previous) => {
  if (previous === 0) return current > 0 ? 100 : 0;
  return Math.round(((current - previous) / previous) * 100);
};

const calculateWeeklyChange = (records, predicate) => {
  const currentWeekStart = startOfWeek(new Date());
  const previousWeekStart = new Date(currentWeekStart);
  previousWeekStart.setDate(previousWeekStart.getDate() - 7);

  const current = records.filter((record) => {
    const createdAt = asDate(record.createdAt);
    return createdAt && createdAt >= currentWeekStart && predicate(record);
  }).length;

  const previous = records.filter((record) => {
    const createdAt = asDate(record.createdAt);
    return (
      createdAt &&
      createdAt >= previousWeekStart &&
      createdAt < currentWeekStart &&
      predicate(record)
    );
  }).length;

  return percentageChange(current, previous);
};

const buildStats = (records) => {
  const isType = (type) => (record) => record.type === type;
  const isAdvice = (record) => ["advisory", "chatbot", "voice"].includes(record.type);

  return {
    totalQueries: records.length,
    cropsAnalyzed: records.filter(isType("advisory")).length,
    imagesScanned: records.filter(isType("image")).length,
    adviceGiven: records.filter(isAdvice).length,
    weeklyChange: {
      totalQueries: calculateWeeklyChange(records, () => true),
      cropsAnalyzed: calculateWeeklyChange(records, isType("advisory")),
      imagesScanned: calculateWeeklyChange(records, isType("image")),
      adviceGiven: calculateWeeklyChange(records, isAdvice),
    },
  };
};

const getDashboardOverview = async (userId = "demoUser") => {
  const [history, activityLogs] = await Promise.all([
    getUserHistory(userId).catch(() => []),
    listActivities(userId, 100).catch(() => []),
  ]);

  const historyRecords = history.map((item) => ({
    id: item.id || item._id?.toString(),
    type: item.type,
    input: item.input,
    output: item.output,
    createdAt: item.createdAt,
  }));

  const activityRecords = activityLogs.map((item) => ({
    id: item.id,
    type: activityType(item),
    input: item.meta?.question || "",
    output: item.message,
    createdAt: item.createdAt,
  }));

  const recordsForStats = historyRecords.length ? historyRecords : activityRecords;
  const recentActivities = activityLogs.length
    ? activityLogs.slice(0, 4).map((item) => ({
        id: item.id,
        title: item.message,
        type: activityType(item),
        createdAt: item.createdAt,
      }))
    : historyRecords.slice(0, 4).map((item) => ({
        id: item.id,
        title: getHistoryTitle(item),
        type: item.type || "activity",
        createdAt: item.createdAt,
      }));

  return {
    user: {
      id: userId,
      name: "Ananya Mishra",
      role: "Farmer / Student",
      status: "online",
    },
    stats: buildStats(recordsForStats),
    activities: recentActivities,
  };
};

module.exports = { getDashboardOverview };
