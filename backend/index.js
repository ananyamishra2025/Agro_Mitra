require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const axios = require("axios");
const path = require("path");
const voiceRoutes = require("./src/modules/voice/voice.routes");

const app = express();
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/api/voice", voiceRoutes);

// Simple request logger
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} ${req.method} ${req.url} - body:`, req.body || {});
  next();
});

// Config
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || "";
const OPENWEATHER_API_KEY = process.env.OPENWEATHER_API_KEY || "";
const GENAI_API_KEY = process.env.GENAI_API_KEY || ""; // optional: for localized advisory via generative AI

// Mongo connection (best-effort) — updated for modern mongoose (v6/v7+)
let mongoConnected = false;
if (MONGO_URI) {
  // optional: disable strictQuery warnings if you want
  try { mongoose.set("strictQuery", false); } catch(e) {}
  mongoose.connect(MONGO_URI)
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

// Submission model (optional)
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

// Crop rules (extend this later with region-specific or dataset)
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

// Helper: fetch weather via OpenWeatherMap (city or "lat,lon")
async function fetchWeatherByLocation(location) {
  if (!OPENWEATHER_API_KEY) {
    return { temp: null, humidity: null, description: "no-api-key (mock)" };
  }
  try {
    // If location looks like "lat,lon" use lat/lon endpoint; otherwise q=city
    let url;
    if (/^-?\d+(\.\d+)?,-?\d+(\.\d+)?$/.test(location)) {
      const [lat, lon] = location.split(",");
      url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${OPENWEATHER_API_KEY}&units=metric`;
    } else {
      url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(location)}&appid=${OPENWEATHER_API_KEY}&units=metric`;
    }
    const resp = await axios.get(url, { timeout: 8000 });
    const j = resp.data;
    return {
      temp: j.main?.temp ?? null,
      humidity: j.main?.humidity ?? null,
      description: j.weather?.[0]?.description ?? "",
      wind: j.wind,
      raw: j
    };
  } catch (err) {
    console.warn("Weather fetch failed:", err.message);
    return { temp: null, humidity: null, description: "weather-failed (mock)" };
  }
}

// Heuristic crop chooser — extend later with models or datasets
function chooseCrops(soil, area, budget, weather) {
  const rules = cropRules[(soil || "loamy").toLowerCase()] || cropRules.loamy;
  const numericArea = Number(area) || 0;
  const desc = (weather?.description || "").toLowerCase();
  const heavyRain = desc.includes("rain") || desc.includes("shower") || desc.includes("thunder");

  // Low resource fallback
  if (numericArea < 0.5 && Number(budget || 0) < 1000) {
    return [{ crop: "Green Gram (Moong)", est_yield_kg: Math.round(numericArea * 400), baseNPK: 6, notes: "low-cost, short-duration legume" }];
  }

  let selected = rules.slice(0, 2).map(r => ({
    crop: r.crop,
    est_yield_kg: Math.round(numericArea * 1000),
    fertilizer: { name: "NPK", qty_kg: Math.max(1, Math.round(r.baseNPK * numericArea)), baseNPK: r.baseNPK },
    notes: `Suitable for ${r.season.join(", ")}`
  }));

  if (heavyRain && (soil || "").toLowerCase() === "clay") {
    selected = [{
      crop: "Paddy",
      est_yield_kg: Math.round(numericArea * 900),
      fertilizer: { name: "NPK", qty_kg: Math.max(1, Math.round(20 * numericArea)), baseNPK: 20 },
      notes: "Water tolerant — choose varieties suited to local region"
    }];
  }

  return selected;
}

// Build fertilizer plan from chosen crops
function buildFertilizerPlan(crops) {
  return crops.map(c => ({
    crop: c.crop,
    fertilizer: c.fertilizer?.name || "NPK",
    qty_kg: c.fertilizer?.qty_kg ?? Math.round((c.baseNPK || 12) * 1),
    timing: "At sowing (tweak per crop)"
  }));
}

// Simple 7-day farmer action plan (can be expanded per crop)
function generateActionPlan(crops) {
  // For demonstration purposes we return a plan per crop
  return crops.map(c => ({
    crop: c.crop,
    plan: [
      "Day 1: Prepare land (plough/level)",
      "Day 2: Sow seeds at recommended spacing",
      "Day 3: Light irrigation",
      "Day 4: Soil & seedling check",
      "Day 5: Apply first fertilizer as per plan",
      "Day 6: Monitor pests and diseases",
      "Day 7: Plan next irrigation/fertilizer schedule"
    ]
  }));
}

// Fertilizer calculator (basic ratio approach)
function fertilizerCalculator(cropName, soilType, area) {
  // Find crop baseNPK
  const soil = (soilType || "loamy").toLowerCase();
  const rules = cropRules[soil] || cropRules.loamy;
  const cropEntry = rules.find(r => r.crop.toLowerCase() === (cropName || "").toLowerCase());
  const baseNPK = cropEntry ? cropEntry.baseNPK : 12; // default
  const qty = Math.max(0, Math.round(baseNPK * (Number(area) || 1)));
  return { crop: cropName || "Unknown", soil: soilType, area, recommended_NPK_kg: qty, baseNPK };
}

// Localized advisory — optional AI integration (best-effort)
async function localizedAdvisory(prompt, context = {}) {
  if (!GENAI_API_KEY) {
    // fallback heuristic reply
    return {
      advisory: `No GENAI_API_KEY provided. Heuristic advice: For ${context.crop || "your crop"}, monitor weather and follow fertilizer schedule. Provide local extension contact for precise seed/variety.`,
      source: "heuristic"
    };
  }

  // Example for OpenAI — user must add real API call details + model
  try {
    // Replace with your preferred GenAI provider and code.
    const openaiResp = await axios.post("https://api.openai.com/v1/chat/completions", {
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }]
    }, {
      headers: { Authorization: `Bearer ${GENAI_API_KEY}` },
      timeout: 10000
    });
    const msg = openaiResp.data?.choices?.[0]?.message?.content || "";
    return { advisory: msg, source: "genai" };
  } catch (e) {
    console.warn("GenAI advisory failed:", e.message);
    return { advisory: "Advisory generation failed (fallback).", source: "error" };
  }
}

// ---------- Endpoints ----------

// GET: list crops
app.get("/api/crops", (req, res) => {
  const all = Object.entries(cropRules).reduce((acc, [soil, rules]) => {
    acc[soil] = rules.map(r => ({ crop: r.crop, baseNPK: r.baseNPK, season: r.season }));
    return acc;
  }, {});
  res.json(all);
});

// POST: fertilizer calculator
app.post("/api/fertilizer", (req, res) => {
  try {
    const { crop, soil, area } = req.body;
    const result = fertilizerCalculator(crop, soil, area);
    return res.json(result);
  } catch (err) {
    console.error("Fertilizer calc error:", err);
    return res.status(500).json({ error: "server error" });
  }
});

// POST: localized advisory (uses GENAI_API_KEY if set, else heuristic)
app.post("/api/advisory", async (req, res) => {
  try {
    const { name, village, crop, soil, area, location, extra } = req.body;
    const prompt = `Farmer: ${name || "unknown"} from ${village || "unknown"}. Crop: ${crop || "unknown"}. Soil: ${soil || "unknown"}. Area: ${area || "unknown"}. Location: ${location || ""}. Extra: ${extra || ""}. Provide localized agronomic advisory, short bullet points, and warnings.`;
    const adv = await localizedAdvisory(prompt, { crop, soil, area, location });
    return res.json(adv);
  } catch (err) {
    console.error("Advisory error:", err);
    return res.status(500).json({ error: "server error" });
  }
});

// POST: recommend (weather-aware + fertilizer + action plan)
app.post("/api/recommend", async (req, res) => {
  try {
    const {
      name = "", village = "", soil = "loamy", area = 1, budget = 0, location = "Patna,IN", sowing_date = ""
    } = req.body;

    const numericArea = Number(area) || 0;
    const weather = await fetchWeatherByLocation(location);
    const crops = chooseCrops(soil, numericArea, budget, weather);
    const fertilizer_plan = buildFertilizerPlan(crops);
    const action_plan = generateActionPlan(crops);

    const response = {
      weather,
      crops,
      fertilizer_plan,
      action_plan
    };

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

// GET: One-click demo
app.get("/api/demo", (req, res) => {
  const demoPayload = {
    name: "Demo Farmer",
    village: "Demo Village",
    soil: "clay",
    area: 1.5,
    budget: 5000,
    location: "Patna,IN",
    sowing_date: new Date().toISOString().split("T")[0]
  };
  // Call internal recommend using demo payload
  fetchWeatherByLocation(demoPayload.location).then(weather => {
    const crops = chooseCrops(demoPayload.soil, demoPayload.area, demoPayload.budget, weather);
    const fertilizer_plan = buildFertilizerPlan(crops);
    const action_plan = generateActionPlan(crops);
    res.json({ demoPayload, weather, crops, fertilizer_plan, action_plan });
  }).catch(e => {
    res.json({ demoPayload, weather: null, error: "demo failed" });
  });
});

// Admin: fetch recent submissions
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
    env: { PORT: process.env.PORT ? true : false, OPENWEATHER_API_KEY: OPENWEATHER_API_KEY ? true : false, GENAI_API_KEY: GENAI_API_KEY ? true : false }
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  if (!MONGO_URI) console.log("MONGO_URI not provided — DB disabled.");
});
