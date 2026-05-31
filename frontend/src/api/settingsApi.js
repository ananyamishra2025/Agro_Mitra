import axiosInstance from "./axiosInstance";

export const getSettings = async () => {
  const response = await axiosInstance.get("/api/settings");
  return response.data;
};

export const updateSettings = async (payload) => {
  const response = await axiosInstance.put("/api/settings", payload);
  return response.data;
};
