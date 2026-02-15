const { getUserHistory } = require("./history.service");

const fetchUserHistory = async (req, res) => {
  try {
    const { userId } = req.params;

    const history = await getUserHistory(userId);

    res.json({
      success: true,
      count: history.length,
      data: history
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch history"
    });
  }
};

module.exports = { fetchUserHistory };
