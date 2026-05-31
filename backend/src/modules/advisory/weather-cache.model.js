const mongoose = require("mongoose");

const weatherCacheSchema = new mongoose.Schema(
  {
    locationKey: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    locationName: {
      type: String,
      required: true,
      trim: true,
    },
    temperature: {
      type: Number,
      default: null,
    },
    humidity: {
      type: Number,
      default: null,
    },
    condition: {
      type: String,
      default: "Unknown",
    },
    windSpeed: {
      type: Number,
      default: null,
    },
    rainChance: {
      type: Number,
      default: null,
    },
    source: {
      type: String,
      default: "openweather",
    },
    fetchedAt: {
      type: Date,
      required: true,
      index: true,
    },
    expiresAt: {
      type: Date,
      required: true,
      index: { expires: 0 },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("WeatherCache", weatherCacheSchema);
