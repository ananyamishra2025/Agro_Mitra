import axiosInstance from "./axiosInstance";

export const getAdvisory = async (payload) => {
  const response = await axiosInstance.post(
    "/api/advisory/recommend",
    payload
  );
  return response.data;
};
