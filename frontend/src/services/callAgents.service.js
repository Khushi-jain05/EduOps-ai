import axios from "axios";

const API = "http://localhost:8000/api/call-agents";

const authHeaders = () => {
  const token = localStorage.getItem("token");
  return { headers: { Authorization: `Bearer ${token}` } };
};

export const getAgents = async () => {
  const res = await axios.get(API, authHeaders());
  return res.data;
};

export const createAgent = async (payload) => {
  const res = await axios.post(API, payload, authHeaders());
  return res.data;
};

export const updateAgent = async (id, payload) => {
  const res = await axios.put(`${API}/${id}`, payload, authHeaders());
  return res.data;
};

export const toggleAgent = async (id) => {
  const res = await axios.patch(`${API}/${id}/toggle`, {}, authHeaders());
  return res.data;
};

export const testCall = async (id) => {
  const res = await axios.post(`${API}/${id}/test-call`, {}, authHeaders());
  return res.data;
};

export const getCallStats = async () => {
  const res = await axios.get(`${API}/stats`, authHeaders());
  return res.data;
};

export const getQueue = async () => {
  const res = await axios.get(`${API}/queue`, authHeaders());
  return res.data;
};

export const generateTranscript = async (callId) => {
  const res = await axios.post(`${API}/queue/${callId}/transcript`, {}, authHeaders());
  return res.data;
};

export const launchCampaign = async (payload) => {
  const res = await axios.post(`${API}/campaign`, payload, authHeaders());
  return res.data;
};

export const advanceQueue = async () => {
  const res = await axios.post(`${API}/queue/advance`, {}, authHeaders());
  return res.data;
};
