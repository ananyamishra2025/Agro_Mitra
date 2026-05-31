require("dotenv").config();
const mongoose = require("mongoose");
const app = require("./app");

const PORT = process.env.PORT || 5000;

// 🔐 Environment Safety Check
if (!process.env.MONGO_URI) {
  console.warn("⚠️ Warning: MONGO_URI not set. Database features may not work.");
}

if (!process.env.GROQ_API_KEY) {
  console.warn("⚠️ Warning: GROQ_API_KEY not set. AI chatbot may not work.");
}

if (!process.env.OPENWEATHER_API_KEY) {
  console.warn("⚠️ Warning: OPENWEATHER_API_KEY not set. Weather integration may not work.");
}

// 🔵 Connect MongoDB (Non-blocking)
if (process.env.MONGO_URI) {
  mongoose
    .connect(process.env.MONGO_URI)
    .then(() => console.log("✅ MongoDB Connected"))
    .catch((err) =>
      console.error("❌ MongoDB Connection Failed:", err.message)
    );
}

// 🚀 Start Server
app.listen(PORT, () => {
  console.log(`🚜 Agro-Mitra backend running on port ${PORT}`);
});
