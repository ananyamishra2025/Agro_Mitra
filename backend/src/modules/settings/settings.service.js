let settings = {
  profile: {
    name: "Ananya Mishra",
    role: "Farmer / Student",
    phone: "",
    location: "Kolkata, West Bengal",
  },
  notifications: {
    weatherAlerts: true,
    advisoryUpdates: true,
    learningResources: true,
    enquiryReplies: true,
  },
  preferences: {
    theme: "light",
    language: "English",
    units: "metric",
  },
  privacy: {
    saveHistory: true,
    allowPersonalization: true,
  },
};

const getSettings = () => settings;

const updateSettings = (payload) => {
  settings = {
    ...settings,
    ...payload,
    profile: { ...settings.profile, ...(payload.profile || {}) },
    notifications: { ...settings.notifications, ...(payload.notifications || {}) },
    preferences: { ...settings.preferences, ...(payload.preferences || {}) },
    privacy: { ...settings.privacy, ...(payload.privacy || {}) },
  };

  return settings;
};

module.exports = { getSettings, updateSettings };
