// 🔥 MUST be the very first line
require("dotenv").config();

console.log("👉 server.js file loaded");

const mongoose = require("mongoose");
const app = require("./app");

const PORT = process.env.PORT || 5000;

// 🔵 Connect MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB Connected");

    // Start server only after DB connection
    app.listen(PORT, () => {
      console.log(`🚜 Agro-Mitra backend running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB Connection Failed:", err.message);
  });
