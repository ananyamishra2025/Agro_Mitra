const { successResponse, errorResponse } = require("../../utils/response");
const {
  listUsers,
  updateUserRole,
  updateUserStatus,
} = require("../auth/auth.service");
const { listContactEnquiries } = require("../contact/contact.service");
const { futureScopes } = require("../future/future.data");

const overview = async (req, res) => {
  const users = await listUsers();
  const contactEnquiries = await listContactEnquiries();
  return successResponse(
    res,
    {
      stats: {
        users: users.length,
        enquiries: contactEnquiries.length,
        futureFeatures: futureScopes.length,
      },
      recentUsers: users.slice(-5).reverse(),
    },
    "Admin overview fetched successfully"
  );
};

const users = async (req, res) => {
  return successResponse(res, { users: await listUsers() }, "Users fetched successfully");
};

const changeRole = async (req, res) => {
  try {
    const user = await updateUserRole(req.params.userId, req.body.role);
    return successResponse(res, { user }, "User role updated successfully");
  } catch (error) {
    return errorResponse(res, error.message, 400);
  }
};

const changeStatus = async (req, res) => {
  try {
    const user = await updateUserStatus(req.params.userId, req.body.status);
    return successResponse(res, { user }, "User status updated successfully");
  } catch (error) {
    return errorResponse(res, error.message, 400);
  }
};

const enquiries = async (req, res) => {
  return successResponse(
    res,
    { enquiries: await listContactEnquiries() },
    "Admin enquiries fetched successfully"
  );
};

module.exports = { changeRole, changeStatus, enquiries, overview, users };
