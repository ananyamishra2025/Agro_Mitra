const { getUserHistory } = require("./history.service");
const { successResponse, errorResponse } = require("../../utils/response");

const fetchUserHistory = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return errorResponse(res, "User ID is required", 400);
    }

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

    return successResponse(
      res,
      {
        count: formattedHistory.length,
        history: formattedHistory
      },
      "User history fetched successfully"
    );

  } catch (error) {
    console.error("History fetch error:", error.message);
    return errorResponse(res, "Failed to fetch history");
  }
};

module.exports = { fetchUserHistory };
