const LearningResource = require("./learning-resource.model");
const { learningResources } = require("./learning.data");
const { isDatabaseConnected } = require("../../utils/database");

const normalizeResource = (resource) => ({
  id: resource.id || resource._id?.toString(),
  title: resource.title,
  type: resource.type,
  category: resource.category || "General",
  description: resource.description || "",
  link: resource.link,
  tags: resource.tags || [],
  isPublished: resource.isPublished ?? true,
  createdAt: resource.createdAt,
});

const getLearningResources = async () => {
  if (!isDatabaseConnected()) return learningResources;

  const count = await LearningResource.countDocuments();
  if (count === 0) {
    await LearningResource.insertMany(
      learningResources.map((resource) => ({
        ...resource,
        category: resource.category || "General",
        isPublished: true,
      }))
    );
  }

  const rows = await LearningResource.find({ isPublished: true }).sort({ createdAt: -1 });
  return rows.map(normalizeResource);
};

module.exports = { getLearningResources };
