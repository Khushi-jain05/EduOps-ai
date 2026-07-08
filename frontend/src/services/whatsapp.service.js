import axios from "axios";

const API = "http://localhost:8000/api/whatsapp";

const authHeaders = () => {
  const token = localStorage.getItem("token");
  return { headers: { Authorization: `Bearer ${token}` } };
};

export const getTemplates = async () => {
  const res = await axios.get(API, authHeaders());
  return res.data;
};

export const createTemplate = async (payload) => {
  const res = await axios.post(API, payload, authHeaders());
  return res.data;
};

export const updateTemplate = async (id, payload) => {
  const res = await axios.put(`${API}/${id}`, payload, authHeaders());
  return res.data;
};

export const toggleTemplate = async (id) => {
  const res = await axios.patch(`${API}/${id}/toggle`, {}, authHeaders());
  return res.data;
};

export const deleteTemplate = async (id) => {
  const res = await axios.delete(`${API}/${id}`, authHeaders());
  return res.data;
};

export const sendTestMessage = async (id, phone) => {
  const res = await axios.post(`${API}/${id}/test`, { phone }, authHeaders());
  return res.data;
};
