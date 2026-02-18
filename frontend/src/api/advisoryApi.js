import axiosInstance from "./axiosInstance";

// Normal advisory API
export const getAdvisory = async (payload) => {
  const response = await axiosInstance.post(
    "/api/advisory/recommend",
    payload
  );
  return response.data;
};

// Demo mode API
export const runDemo = async () => {
  const response = await axiosInstance.get("/api/demo/run");
  return response.data;
};
