const { successResponse, errorResponse } = require("../../utils/response");
const { getSettings, updateSettings } = require("./settings.service");

const fetchSettings = (req, res) => {
  return successResponse(res, getSettings(), "Settings fetched successfully");
};

const saveSettings = (req, res) => {
  try {
    const settings = updateSettings(req.body || {});
    return successResponse(res, settings, "Settings updated successfully");
  } catch (error) {
    console.error("Settings update error:", error.message);
    return errorResponse(res, "Failed to update settings");
  }
};

module.exports = { fetchSettings, saveSettings };
