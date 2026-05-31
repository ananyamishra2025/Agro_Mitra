import axiosInstance from "./axiosInstance";

export const loginUser = async (payload) => {
  const response = await axiosInstance.post("/api/auth/login", payload);
  return response.data;
};

export const registerUser = async (payload) => {
  const response = await axiosInstance.post("/api/auth/register", payload);
  return response.data;
};

export const loginWithGoogle = async (payload) => {
  const response = await axiosInstance.post("/api/auth/google", payload);
  return response.data;
};

export const changePassword = async (payload) => {
  const response = await axiosInstance.post("/api/auth/change-password", payload);
  return response.data;
};
