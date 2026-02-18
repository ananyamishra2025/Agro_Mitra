import axiosInstance from "./axiosInstance";

export const getHistory = async (userId) => {
  const response = await axiosInstance.get(`/api/history/${userId}`);
  return response.data;
};
