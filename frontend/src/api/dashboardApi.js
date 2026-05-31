import axiosInstance from "./axiosInstance";

export const getDashboardOverview = async () => {
  const response = await axiosInstance.get("/api/dashboard/overview");
  return response.data;
};
