import axiosInstance from "./axiosInstance";

export const getGardeningTips = async () => {
  const response = await axiosInstance.get("/api/gardening");
  return response.data;
};
