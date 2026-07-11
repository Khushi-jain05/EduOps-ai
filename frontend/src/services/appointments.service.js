import axios from "axios";

const API = "http://localhost:8000/api/admin-appointments";

const authHeaders = () => {
  const token = localStorage.getItem("token");
  return { headers: { Authorization: `Bearer ${token}` } };
};

export const getAdminAppointments = async () => {
  const res = await axios.get(API, authHeaders());
  return res.data;
};

export const updateAppointment = async (id, payload) => {
  const res = await axios.put(`${API}/${id}`, payload, authHeaders());
  return res.data;
};

export const regenerateLink = async (id) => {
  const res = await axios.post(`${API}/${id}/regenerate-link`, {}, authHeaders());
  return res.data;
};
