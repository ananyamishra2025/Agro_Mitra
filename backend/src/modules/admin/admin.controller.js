const { successResponse, errorResponse } = require("../../utils/response");
const {
  listUsers,
  updateUserRole,
  updateUserStatus,
} = require("../auth/auth.service");
const { listContactEnquiries } = require("../contact/contact.service");
const { futureScopes } = require("../future/future.data");

const overview = (req, res) => {
  const users = listUsers();
  return successResponse(
    res,
    {
      stats: {
        users: users.length,
        enquiries: listContactEnquiries().length,
        futureFeatures: futureScopes.length,
      },
      recentUsers: users.slice(-5).reverse(),
    },
    "Admin overview fetched successfully"
  );
};

const users = (req, res) => {
  return successResponse(res, { users: listUsers() }, "Users fetched successfully");
};

const changeRole = (req, res) => {
  try {
    const user = updateUserRole(req.params.userId, req.body.role);
    return successResponse(res, { user }, "User role updated successfully");
  } catch (error) {
    return errorResponse(res, error.message, 400);
  }
};

const changeStatus = (req, res) => {
  try {
    const user = updateUserStatus(req.params.userId, req.body.status);
    return successResponse(res, { user }, "User status updated successfully");
  } catch (error) {
    return errorResponse(res, error.message, 400);
  }
};

const enquiries = (req, res) => {
  return successResponse(
    res,
    { enquiries: listContactEnquiries() },
    "Admin enquiries fetched successfully"
  );
};

module.exports = { changeRole, changeStatus, enquiries, overview, users };
