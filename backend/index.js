const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

app.post("/api/recommend", (req, res) => {
  const { soil, area, budget } = req.body;
  
  // SIMPLE RULE ENGINE
  const response = {
    crops: ["Maize", "Wheat"],
    fertilizer: `NPK: ${15 * area} kg`,
    actionPlan: ["Prepare land", "Sow seeds", "Water the field", "Apply fertilizer"]
  };

  res.json(response);
});

app.listen(5000, () => console.log("Server running on port 5000"));
