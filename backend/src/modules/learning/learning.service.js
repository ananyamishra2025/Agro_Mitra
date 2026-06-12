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
  publisher: resource.publisher || "",
  year: resource.year,
  format: resource.format || "",
  featured: resource.featured ?? false,
  isPublished: resource.isPublished ?? true,
  createdAt: resource.createdAt,
});

const getLearningResources = async () => {
  if (!isDatabaseConnected()) return learningResources;

  await LearningResource.bulkWrite(
    learningResources.map((resource) => ({
      updateOne: {
        filter: { link: resource.link },
        update: {
          $set: {
            ...resource,
            category: resource.category || "General",
            isPublished: true,
          },
        },
        upsert: true,
      },
    }))
  );

  const curatedLinks = learningResources.map((resource) => resource.link);
  const rows = await LearningResource.find({
    isPublished: true,
    link: { $in: curatedLinks },
  }).sort({ featured: -1, category: 1, title: 1 });
  return rows.map(normalizeResource);
};

module.exports = { getLearningResources };
