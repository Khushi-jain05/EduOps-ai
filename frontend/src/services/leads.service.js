import axios from "axios";

const API = "http://localhost:8000/api/leads";

const authHeaders = () => {
  const token = localStorage.getItem("token");
  return { headers: { Authorization: `Bearer ${token}` } };
};

export const getLeads = async (params = {}) => {
  const res = await axios.get(API, { ...authHeaders(), params });
  return res.data;
};

export const getLeadStats = async () => {
  const res = await axios.get(`${API}/stats`, authHeaders());
  return res.data;
};

export const getLeadScoring = async () => {
  const res = await axios.get(`${API}/scoring`, authHeaders());
  return res.data;
};

export const getLeadActivity = async () => {
  const res = await axios.get(`${API}/activity`, authHeaders());
  return res.data;
};

export const createLead = async (payload) => {
  const res = await axios.post(API, payload, authHeaders());
  return res.data;
};

export const updateLead = async (id, payload) => {
  const res = await axios.put(`${API}/${id}`, payload, authHeaders());
  return res.data;
};

export const deleteLead = async (id) => {
  const res = await axios.delete(`${API}/${id}`, authHeaders());
  return res.data;
};

export const getWorkspaceStats = async () => {
  const res = await axios.get(`${API}/workspace-stats`, authHeaders());
  return res.data;
};

export const getFollowUps = async () => {
  const res = await axios.get(`${API}/follow-ups`, authHeaders());
  return res.data;
};

export const getCounselorPerformance = async () => {
  const res = await axios.get(`${API}/counselor-performance`, authHeaders());
  return res.data;
};
