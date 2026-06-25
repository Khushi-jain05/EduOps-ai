import axios from "axios";

const API = "http://localhost:8000/api/chat";

export const sendMessage = async (chatId, message) => {
  const token = localStorage.getItem("token");

  const res = await axios.post(
    `${API}/message`,
    {
      chatId,
      message,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return res.data;
};

export const getChats = async () => {
  const token = localStorage.getItem("token");

  const res = await axios.get(API, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data;
};