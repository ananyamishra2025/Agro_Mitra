console.log("👉 app.js file loaded");

const express = require("express");
const cors = require("cors");
const path = require("path");

const routes = require("./routes");

const app = express();

// ✅ Middlewares
app.use(cors());
app.use(express.json());

// 🔴 THIS LINE WAS MISSING (IMPORTANT FOR FORM-DATA & VOICE)
app.use(express.urlencoded({ extended: true }));

// ✅ Serve uploaded files
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

// ✅ Mount ALL routes under /api
app.use("/api", routes);

// ✅ Health check
app.get("/", (req, res) => {
  res.json({
    status: "OK",
    message: "Agro-Mitra backend running",
  });
});

module.exports = app;
