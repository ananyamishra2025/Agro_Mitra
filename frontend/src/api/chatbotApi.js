import axiosInstance from "./axiosInstance";

export const askChatbot = async (payload) => {
  const response = await axiosInstance.post(
    "/api/chatbot/ask",
    payload
  );
  return response.data;
};
