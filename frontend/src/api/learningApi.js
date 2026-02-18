import axiosInstance from "./axiosInstance";

export const getLearningResources = async () => {
  const response = await axiosInstance.get("/api/learning/resources");
  return response.data;
};
