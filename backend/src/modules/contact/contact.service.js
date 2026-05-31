const enquiries = [];

const createContactEnquiry = (payload) => {
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

const listContactEnquiries = () => enquiries;

module.exports = { createContactEnquiry, listContactEnquiries };
