const { successResponse } = require("../../utils/response");
const { futureScopes } = require("./future.data");

const fetchFutureScopes = (req, res) => {
  return successResponse(
    res,
    { features: futureScopes },
    "Future scope features fetched successfully"
  );
};

module.exports = { fetchFutureScopes };
