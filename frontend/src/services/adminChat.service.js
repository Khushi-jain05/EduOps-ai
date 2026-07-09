import axios from "axios";

const API = "http://localhost:8000/api/admin-chat";

const authHeaders = () => {
  const token = localStorage.getItem("token");
  return { headers: { Authorization: `Bearer ${token}` } };
};

export const getChats = async () => {
  const res = await axios.get(API, authHeaders());
  return res.data;
};

export const getChatMessages = async (id) => {
  const res = await axios.get(`${API}/${id}`, authHeaders());
  return res.data;
};

export const sendMessage = async (chatId, message) => {
  const res = await axios.post(`${API}/message`, { chatId, message }, authHeaders());
  return res.data;
};
