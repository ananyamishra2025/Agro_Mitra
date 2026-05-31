const Contact = require("./contact.model");
const { isDatabaseConnected } = require("../../utils/database");

const enquiries = [];

const normalizeContact = (enquiry) => ({
  id: enquiry.id || enquiry._id?.toString(),
  name: enquiry.name,
  contact: enquiry.contact,
  category: enquiry.category,
  location: enquiry.location,
  message: enquiry.message,
  status: enquiry.status,
  createdAt: enquiry.createdAt,
  updatedAt: enquiry.updatedAt,
});

const createContactEnquiry = async (payload) => {
  if (isDatabaseConnected()) {
    const enquiry = await Contact.create({
      name: payload.name,
      contact: payload.contact,
      category: payload.category || "General enquiry",
      location: payload.location || "",
      message: payload.message,
      status: "new",
    });

    return normalizeContact(enquiry);
  }

  const enquiry = {
    id: `enquiry_${Date.now()}`,
    name: payload.name,
    contact: payload.contact,
    category: payload.category || "General enquiry",
    location: payload.location || "",
    message: payload.message,
    status: "new",
    createdAt: new Date().toISOString(),
  };

  enquiries.unshift(enquiry);
  return enquiry;
};

const listContactEnquiries = async () => {
  if (isDatabaseConnected()) {
    const rows = await Contact.find().sort({ createdAt: -1 });
    return rows.map(normalizeContact);
  }

  return enquiries;
};

module.exports = { createContactEnquiry, listContactEnquiries };
