import axiosInstance from "./axiosInstance";

export const uploadImage = async (formData) => {
  const response = await axiosInstance.post(
    "/api/upload/image",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return response.data;
};
