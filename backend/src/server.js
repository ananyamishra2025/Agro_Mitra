console.log("👉 server.js file loaded");

require("./config/env");

const app = require("./app");

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚜 Agro-Mitra backend running on port ${PORT}`);
});
