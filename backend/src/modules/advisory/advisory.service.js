const { CROP_RULES } = require("../../utils/constants");
const { getWeatherByLocation } = require("./weather.service");

const generateAdvisory = async ({ location, season, soilType, landSize }) => {
  // 1️⃣ Get weather data (safe fallback inside service)
  const weather = await getWeatherByLocation(location);

  // 2️⃣ Crop recommendation using existing rules
  const recommendedCrops =
    CROP_RULES[season]?.[soilType] || ["Seasonal local crops"];

  // 3️⃣ Weather-based advice
  let weatherAdvice = "Weather data not available";

  if (weather.condition === "Rain") {
    weatherAdvice = "Rain expected, delay fertilizer application";
  } else if (weather.temperature && weather.temperature < 20) {
    weatherAdvice = "Cool weather suitable for winter crops";
  } else if (weather.temperature && weather.temperature > 35) {
    weatherAdvice = "High temperature, ensure sufficient irrigation";
  } else {
    weatherAdvice = "Good weather for farming activities";
  }

  // 4️⃣ Final advisory response
  return {
    weather,
    weatherAdvice,
    recommendedCrops,
    fertilizerAdvice: `${landSize * 12} kg NPK recommended`,
    actionPlan: [
      "Prepare the land properly",
      "Sow seeds at correct spacing",
      "Irrigate regularly",
      "Apply fertilizer after 20 days"
    ]
  };
};

module.exports = { generateAdvisory };
