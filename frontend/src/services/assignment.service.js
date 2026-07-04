import axios from "axios";

const API = "http://localhost:8000/api/assignments";

const authHeaders = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
});

export const getAssignments = async () => {
  const res = await axios.get(API, authHeaders());
  return res.data;
};

export const getAssignmentById = async (id) => {
  const res = await axios.get(`${API}/${id}`, authHeaders());
  return res.data;
};

export const getStudentAssignments = async (studentId) => {
  const res = await axios.get(`${API}/student/${studentId}`, authHeaders());
  return res.data;
};

export const generateAssignment = async (data) => {
  const body = new FormData();

  Object.entries(data).forEach(([key, value]) => {
    if (value === undefined || value === null) return;
    body.append(key, value);
  });

  const res = await axios.post(`${API}/generate`, body, authHeaders());
  return res.data;
};

export const createAssignment = async (payload) => {
  const res = await axios.post(API, payload, authHeaders());
  return res.data;
};

export const updateAssignment = async (id, payload) => {
  const res = await axios.put(`${API}/${id}`, payload, authHeaders());
  return res.data;
};

export const deleteAssignment = async (id) => {
  await axios.delete(`${API}/${id}`, authHeaders());
};

export const submitAssignment = async (id, payload) => {
  const res = await axios.post(`${API}/${id}/submit`, payload, authHeaders());
  return res.data;
};

export const gradeSubmission = async (id, studentId, payload) => {
  const res = await axios.put(`${API}/${id}/grade/${studentId}`, payload, authHeaders());
  return res.data;
};
