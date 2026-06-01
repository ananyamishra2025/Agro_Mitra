import axiosInstance from "./axiosInstance";

export const uploadImage = async (formData) => {
  const response = await axiosInstance.post(
    "/api/upload/image",
    formData
  );

  return response.data;
};
