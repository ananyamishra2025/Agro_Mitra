const axios = require("axios");
const WeatherCache = require("./weather-cache.model");
const { isDatabaseConnected } = require("../../utils/database");

const CACHE_TTL_MS = 30 * 60 * 1000;

const getCachedWeather = async (location) => {
  if (!isDatabaseConnected()) return null;

  const locationKey = location.trim().toLowerCase();
  return WeatherCache.findOne({
    locationKey,
    expiresAt: { $gt: new Date() },
  });
};

const saveWeatherCache = async (location, weather) => {
  if (!isDatabaseConnected()) return;

  const now = new Date();
  await WeatherCache.findOneAndUpdate(
    { locationKey: location.trim().toLowerCase() },
    {
      locationKey: location.trim().toLowerCase(),
      locationName: location,
      ...weather,
      fetchedAt: now,
      expiresAt: new Date(now.getTime() + CACHE_TTL_MS),
    },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );
};

const getWeatherByLocation = async (location) => {
  try {
    const cachedWeather = await getCachedWeather(location);
    if (cachedWeather) {
      return {
        temperature: cachedWeather.temperature,
        humidity: cachedWeather.humidity,
        condition: cachedWeather.condition,
        windSpeed: cachedWeather.windSpeed,
        rainChance: cachedWeather.rainChance,
      };
    }

    // 1️⃣ Read API key from environment
    const apiKey = process.env.OPENWEATHER_API_KEY;

    if (!apiKey) {
      console.error("❌ OPENWEATHER_API_KEY is missing in .env");
      throw new Error("API key missing");
    }

    // 2️⃣ Encode location (VERY IMPORTANT)
    const encodedLocation = encodeURIComponent(location);

    // 3️⃣ Build request URL
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodedLocation}&units=metric&appid=${apiKey}`;

    // 5️⃣ Call OpenWeather API
    const response = await axios.get(url);

    // 6️⃣ Return clean weather object
    const weather = {
      temperature: response.data.main.temp,
      humidity: response.data.main.humidity,
      condition: response.data.weather[0].main,
      windSpeed: response.data.wind?.speed ?? null,
      rainChance: response.data.rain ? 100 : 0,
    };

    await saveWeatherCache(location, weather);
    return weather;

  } catch (error) {
    // 7️⃣ Log real error (do NOT hide it)
    console.error(
      "❌ Weather API Error:",
      error.response?.data || error.message
    );

    // 8️⃣ Safe fallback (important for production)
    return {
      temperature: null,
      humidity: null,
      condition: "Unable to fetch weather"
    };
  }
};

module.exports = { getWeatherByLocation };
