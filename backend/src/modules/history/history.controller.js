const { getUserHistory } = require("./history.service");

const fetchUserHistory = async (req, res) => {
  try {
    const { userId } = req.params;

    const history = await getUserHistory(userId);

    // 🔥 Format timestamps cleanly
    const formattedHistory = history.map(item => ({
      id: item._id,
      userId: item.userId,
      type: item.type,
      input: item.input,
      output: item.output,
      createdAt: new Date(item.createdAt).toLocaleString("en-IN", {
        dateStyle: "medium",
        timeStyle: "short"
      })
    }));

    res.json({
      success: true,
      count: formattedHistory.length,
      data: formattedHistory
    });

  } catch (error) {
    console.error("History fetch error:", error.message);

    res.status(500).json({
      success: false,
      message: "Failed to fetch history"
    });
  }
};

module.exports = { fetchUserHistory };
