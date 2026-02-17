const axios = require("axios");

const getWeatherByLocation = async (location) => {
  try {
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
    return {
      temperature: response.data.main.temp,
      humidity: response.data.main.humidity,
      condition: response.data.weather[0].main
    };

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
