const { getUserHistory } = require("../history/history.service");

const defaultActivities = [
  {
    title: "Crop advisory for Wheat",
    type: "advisory",
    time: "2 hours ago",
  },
  {
    title: "Tomato leaf disease detected",
    type: "image",
    time: "5 hours ago",
  },
  {
    title: "Fertilizer recommendation generated",
    type: "advisory",
    time: "1 day ago",
  },
  {
    title: "Voice query processed",
    type: "voice",
    time: "2 days ago",
  },
];

const getDashboardOverview = async (userId = "demoUser") => {
  let history = [];

  try {
    history = await getUserHistory(userId);
  } catch (error) {
    history = [];
  }

  const historyCount = history.length;

  return {
    user: {
      id: userId,
      name: "Ananya Mishra",
      role: "Farmer / Student",
      status: "online",
    },
    stats: {
      totalQueries: Math.max(124, historyCount),
      cropsAnalyzed: 18,
      imagesScanned: 42,
      adviceGiven: 87,
    },
    activities: history.length
      ? history.slice(0, 4).map((item) => ({
          title: item.type ? `${item.type} activity` : "Agro-Mitra activity",
          type: item.type || "activity",
          time: item.createdAt || "Recently",
        }))
      : defaultActivities,
  };
};

module.exports = { getDashboardOverview };
