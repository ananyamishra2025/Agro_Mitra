import axiosInstance from "./axiosInstance";

export const askVoice = async (formData) => {
  const response = await axiosInstance.post("/api/voice/ask", formData);

  return response.data;
};

export const askVoiceText = async (payload) => {
  const response = await axiosInstance.post("/api/voice/ask", payload);
  return response.data;
};
