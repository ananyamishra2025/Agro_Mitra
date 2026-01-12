const { successResponse } = require("../../utils/response");

exports.getAdvisory = async (req, res) => {
  const { crop, location } = req.body;

  return successResponse(res, {
    message: "Advisory generated successfully",
    input: { crop, location },
    recommendation: "Wheat is suitable in winter for loamy soil",
  });
};
