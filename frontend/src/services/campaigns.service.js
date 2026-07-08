import axios from "axios";

const API = "http://localhost:8000/api/campaigns";

const authHeaders = () => {
  const token = localStorage.getItem("token");
  return { headers: { Authorization: `Bearer ${token}` } };
};

export const getCampaigns = async () => {
  const res = await axios.get(API, authHeaders());
  return res.data;
};

export const createCampaign = async (payload) => {
  const res = await axios.post(API, payload, authHeaders());
  return res.data;
};

export const updateCampaign = async (id, payload) => {
  const res = await axios.put(`${API}/${id}`, payload, authHeaders());
  return res.data;
};

export const deleteCampaign = async (id) => {
  const res = await axios.delete(`${API}/${id}`, authHeaders());
  return res.data;
};
