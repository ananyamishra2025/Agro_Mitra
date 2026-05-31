const express = require("express");
const cors = require("cors");
const path = require("path");

const { corsOptions } = require("./config/security");
const { apiRateLimiter, securityHeaders } = require("./middlewares/security.middleware");
const { sanitizeBody } = require("./middlewares/validation.middleware");
const routes = require("./routes");
const errorHandler = require("./middlewares/error.middleware");

const app = express();

// ================= MIDDLEWARES =================

app.use(securityHeaders);
app.use(cors(corsOptions));
app.options("*", cors(corsOptions));
app.use(apiRateLimiter);
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true, limit: "1mb" }));
app.use(sanitizeBody);

// ================= STATIC FILES =================

app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

// ================= ROUTES =================

app.use("/api", routes);

// ================= HEALTH CHECK =================

app.get("/", (req, res) => {
  res.json({
    status: "OK",
    message: "Agro-Mitra backend running"
  });
});

// ================= GLOBAL ERROR HANDLER =================
// 🔥 Must be LAST middleware
app.use(errorHandler);

module.exports = app;
