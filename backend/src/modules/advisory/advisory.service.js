const { CROP_RULES } = require("../../utils/constants");
const { getWeatherByLocation } = require("./weather.service");

const generateAdvisory = async ({ location, season, soilType, landSize }) => {

  // 1️⃣ Get weather data
  const weather = await getWeatherByLocation(location);

  // 2️⃣ Crop recommendation
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

  // 4️⃣ 🔥 FIX: Proper Fertilizer Calculation

  // Extract numeric value from string like "2 acres"
  const numericLandSize = parseFloat(landSize);

  if (isNaN(numericLandSize)) {
    throw new Error("Invalid land size format. Example: '2 acres'");
  }

  const fertilizerPerAcre = 12; // example logic
  const totalFertilizer = (numericLandSize * fertilizerPerAcre).toFixed(2);

  const fertilizerAdvice = `${totalFertilizer} kg NPK recommended`;

  // 5️⃣ Final response
  return {
    weather,
    weatherAdvice,
    recommendedCrops,
    fertilizerAdvice,
    actionPlan: [
      "Prepare the land properly",
      "Sow seeds at correct spacing",
      "Irrigate regularly",
      "Apply fertilizer after 20 days"
    ]
  };
};

module.exports = { generateAdvisory };
