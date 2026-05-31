const { buildRecommendation } = require("../ai/recommendation-engine.service");
const { getWeatherByLocation } = require("./weather.service");

const generateAdvisory = async ({ location, season, soilType, landSize }) => {
  const weather = await getWeatherByLocation(location);

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

  const recommendation = buildRecommendation({
    location,
    season,
    soilType,
    landSize,
    temperature: weather.temperature,
    rainfall: weather.rainChance,
  });

  return {
    ...recommendation,
    weather,
    weatherAdvice,
  };
};

module.exports = { generateAdvisory };
