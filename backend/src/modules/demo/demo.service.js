const runDemo = async () => {
  // Keep the demo deterministic so the Crop Advisory page always shows a
  // complete result, even when external AI/weather services are unavailable.
  return {
    demo: true,
    location: "Kolkata, West Bengal",
    season: "Rabi / Winter",
    soilType: "Loamy soil",
    landSize: "2 acres",
    weatherAdvice:
      "Mild weather is suitable for wheat, mustard, and vegetable crops. Keep irrigation light and regular.",
    recommendedCrops: ["Wheat", "Mustard", "Potato", "Cabbage"],
    fertilizerAdvice:
      "Apply 45 kg urea, 25 kg DAP, and 20 kg MOP per acre. Split nitrogen into two doses: first during sowing and second after 20-25 days.",
    actionPlan: [
      "Prepare raised beds and check soil moisture before sowing.",
      "Use certified seeds and maintain proper row spacing.",
      "Irrigate every 7-10 days depending on rainfall and field moisture.",
      "Monitor leaves weekly for yellowing, pests, or fungal spots.",
      "Record crop progress in history after every major field activity."
    ]
  };
};

module.exports = { runDemo };
