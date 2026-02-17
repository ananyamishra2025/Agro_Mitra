const express = require("express");
const cors = require("cors");
const path = require("path");

const routes = require("./routes");
const errorHandler = require("./middlewares/error.middleware");

const app = express();

// ================= MIDDLEWARES =================

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // for form-data

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
