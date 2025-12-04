require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const axios = require("axios");

const app = express();
app.use(cors());
app.use(express.json());

// Basic request logger (helpful for screenshots/docs)
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} ${req.method} ${req.url} - body:`, req.body || {});
  next();
});

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || "";
const OPENWEATHER_API_KEY = process.env.OPENWEATHER_API_KEY || "";

// Connect to Mongo (Atlas or local). Best-effort: continue even if DB fails.
let mongoConnected = false;
if (MONGO_URI) {
  mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
      mongoConnected = true;
      console.log("Mongo connected");
    })
    .catch(err => {
      mongoConnected = false;
      console.warn("Mongo connection failed (continuing without DB):", err.message);
    });
} else {
  console.warn("MONGO_URI not provided — continuing without DB (submissions won't persist).");
}

// Submission schema (optional persistence)
let Submission = null;
try {
  const submissionSchema = new mongoose.Schema({
    name: String,
    village: String,
    soil: String,
    area: Number,
    budget: Number,
    location: String,
    sowing_date: String,
    weather: Object,
    recommendation: Object,
    createdAt: { type: Date, default: Date.now }
  });
  Submission = mongoose.models.Submission || mongoose.model("Submission", submissionSchema);
} catch (e) {
  Submission = null;
}

// Simple crop rules (extendable)
const cropRules = {
  loamy: [
    { crop: "Maize", season: ["kharif"], baseNPK: 15 },
    { crop: "Wheat", season: ["rabi"], baseNPK: 12 }
  ],
  sandy: [
    { crop: "Groundnut", season: ["kharif"], baseNPK: 10 },
    { crop: "Millet", season: ["kharif"], baseNPK: 8 }
  ],
  clay: [
    { crop: "Paddy", season: ["kharif"], baseNPK: 20 }
  ]
};

// Helper: fetch weather by city using OpenWeatherMap (safe fallback)
async function fetchWeatherByCity(city) {
  if (!OPENWEATHER_API_KEY) {
    return { temp: null, humidity: null, description: "no-api-key (mock)" };
  }
  try {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${OPENWEATHER_API_KEY}&units=metric`;
    const resp = await axios.get(url, { timeout: 8000 });
    const j = resp.data;
    return {
      temp: j.main?.temp ?? null,
      humidity: j.main?.humidity ?? null,
      description: j.weather?.[0]?.description ?? "",
      raw: j
    };
  } catch (err) {
    console.warn("Weather fetch failed:", err.message);
    return { temp: null, humidity: null, description: "weather-failed (mock)" };
  }
}

// Small utility: choose crops based on soil, area, budget and simple weather hints
function chooseCrops(soil, area, budget, weather) {
  const rules = cropRules[(soil || "loamy").toLowerCase()] || cropRules.loamy;

  // Filter by simple heuristics:
  // - if budget < 1000 and area < 0.5 recommend low-cost legumes/vegetables (fallback)
  if ((Number(area) || 0) < 0.5 && (Number(budget) || 0) < 1000) {
    return [{ crop: "Green Gram (Moong)", est_yield: Math.round(area * 400), baseNPK: 6 }];
  }

  // If heavy rain expected (description contains rain), prefer water-tolerant crop if available
  const desc = (weather?.description || "").toLowerCase();
  const heavyRain = desc.includes("rain") || desc.includes("shower") || desc.includes("thunder");

  let selected = rules.slice(0, 2).map(r => ({
    crop: r.crop,
    est_yield: Math.round((Number(area) || 0) * 1000), // placeholder estimate
    fertilizer: { name: "NPK", qty_kg: Math.round(r.baseNPK * (Number(area) || 0)), baseNPK: r.baseNPK }
  }));

  if (heavyRain) {
    // prefer paddy if clay exists
    if ((soil || "").toLowerCase() === "clay") {
      selected = [{ crop: "Paddy", est_yield: Math.round((Number(area) || 0) * 900), fertilizer: { name: "NPK", qty_kg: 20 * (Number(area) || 0), baseNPK: 20 } }];
    }
  }

  return selected;
}

// Create fertilizer plan from chosen crops
function buildFertilizerPlan(crops) {
  return crops.map(c => ({
    fertilizer: c.fertilizer?.name || "NPK",
    qty_kg: c.fertilizer?.qty_kg ?? Math.round((c.baseNPK || 12) * 1),
    timing: "At sowing"
  }));
}

// Generate a simple 7-day action plan per crop (generic)
function generateActionPlan(crops) {
  // Simple generic plan — can be customized per crop
  return [
    "Day 1: Prepare land (plough/level)",
    "Day 2: Sow seeds at recommended spacing",
    "Day 3: Light irrigation",
    "Day 4: Soil & seedling check",
    "Day 5: Apply first fertilizer as per plan",
    "Day 6: Monitor pests and diseases",
    "Day 7: Plan next irrigation/fertilizer schedule"
  ];
}

// Main recommend endpoint
app.post("/api/recommend", async (req, res) => {
  try {
    const {
      name = "",
      village = "",
      soil = "loamy",
      area = 1,
      budget = 0,
      location = "Patna,IN",
      sowing_date = ""
    } = req.body;

    const numericArea = Number(area) || 0;

    // 1) fetch weather (best-effort)
    const weather = await fetchWeatherByCity(location);

    // 2) choose crops
    const crops = chooseCrops(soil, numericArea, budget, weather);

    // 3) fertilizer plan
    const fertilizer_plan = buildFertilizerPlan(crops);

    // 4) action plan
    const action_plan = generateActionPlan(crops);

    // Compose response
    const response = {
      weather,
      crops,
      fertilizer_plan,
      action_plan
    };

    // 5) Save submission to DB if available
    if (mongoConnected && Submission) {
      try {
        await Submission.create({
          name, village, soil, area: numericArea, budget, location, sowing_date,
          weather, recommendation: response
        });
      } catch (e) {
        console.warn("Failed to save submission:", e.message);
      }
    }

    return res.json(response);
  } catch (err) {
    console.error("Recommend error:", err);
    return res.status(500).json({ error: "server error" });
  }
});

// Admin endpoint: recent submissions (if DB connected)
app.get("/api/submissions", async (req, res) => {
  if (!mongoConnected || !Submission) return res.json([]);
  try {
    const rows = await Submission.find().sort({ createdAt: -1 }).limit(50).lean();
    return res.json(rows);
  } catch (e) {
    console.error("Fetch submissions error:", e);
    return res.status(500).json({ error: "cannot fetch submissions" });
  }
});

// Health check
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    mongoConnected,
    env: { PORT: process.env.PORT ? true : false, OPENWEATHER_API_KEY: OPENWEATHER_API_KEY ? true : false }
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  if (!MONGO_URI) console.log("MONGO_URI not provided — DB disabled.");
});
