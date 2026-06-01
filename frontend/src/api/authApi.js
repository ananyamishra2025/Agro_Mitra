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

export const getCurrentUser = async () => {
  const response = await axiosInstance.get("/api/auth/me");
  return response.data;
};

export const updateProfile = async (payload) => {
  const response = await axiosInstance.put("/api/auth/profile", payload);
  return response.data;
};

export const logoutUser = async () => {
  const response = await axiosInstance.post("/api/auth/logout", {});
  return response.data;
};
