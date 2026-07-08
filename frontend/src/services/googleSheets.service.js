import axios from "axios";

const API = "http://localhost:8000/api/google-sheets";

const authHeaders = () => {
  const token = localStorage.getItem("token");
  return { headers: { Authorization: `Bearer ${token}` } };
};

export const getSheetStatus = async () => {
  const res = await axios.get(API, authHeaders());
  return res.data;
};

export const syncSheetNow = async () => {
  const res = await axios.post(`${API}/sync`, {}, authHeaders());
  return res.data;
};

export const updateSheetUrl = async (sheet_url) => {
  const res = await axios.put(API, { sheet_url }, authHeaders());
  return res.data;
};
