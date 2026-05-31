const { successResponse, errorResponse } = require("../../utils/response");
const { createContactEnquiry, listContactEnquiries } = require("./contact.service");

const submitContactEnquiry = async (req, res) => {
  try {
    const { name, contact, message } = req.body;

    if (!name || !contact || !message) {
      return errorResponse(res, "Name, contact, and message are required", 400);
    }

    const enquiry = await createContactEnquiry(req.body);
    return successResponse(res, enquiry, "Enquiry submitted successfully", 201);
  } catch (error) {
    console.error("Contact enquiry error:", error.message);
    return errorResponse(res, "Failed to submit enquiry");
  }
};

const fetchContactEnquiries = async (req, res) => {
  return successResponse(
    res,
    { enquiries: await listContactEnquiries() },
    "Contact enquiries fetched successfully"
  );
};

module.exports = { submitContactEnquiry, fetchContactEnquiries };
