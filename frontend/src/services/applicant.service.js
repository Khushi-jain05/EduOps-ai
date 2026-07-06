import axios from "axios";

const API = "http://localhost:8000/api/applicant";

const authHeaders = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
});

export const getApplicantDashboard = async () => {
  const res = await axios.get(`${API}/dashboard`, authHeaders());
  return res.data;
};

export const getPrograms = async () => {
  const res = await axios.get(`${API}/programs`, authHeaders());
  return res.data;
};

export const advanceApplication = async () => {
  const res = await axios.post(`${API}/application/advance`, {}, authHeaders());
  return res.data;
};

export const getAppointments = async () => {
  const res = await axios.get(`${API}/appointments`, authHeaders());
  return res.data;
};

export const bookAppointment = async (payload) => {
  const res = await axios.post(`${API}/appointments`, payload, authHeaders());
  return res.data;
};

export const askAdmissions = async (question) => {
  const res = await axios.post(`${API}/ask`, { question }, authHeaders());
  return res.data;
};

export const getApplication = async () => {
  const res = await axios.get(`${API}/application`, authHeaders());
  return res.data;
};

export const saveApplication = async (payload) => {
  const res = await axios.post(`${API}/application`, payload, authHeaders());
  return res.data;
};
