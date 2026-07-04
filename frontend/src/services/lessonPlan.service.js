import axios from "axios";

const API = "http://localhost:8000/api/lesson-plans";

const authHeaders = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
});

export const createLessonPlan = async (data) => {
  const res = await axios.post(API, data, authHeaders());
  return res.data;
};

export const getLessonPlans = async () => {
  const res = await axios.get(API, authHeaders());
  return res.data;
};

export const getLessonPlanById = async (id) => {
  const res = await axios.get(`${API}/${id}`, authHeaders());
  return res.data;
};

export const updateLessonPlan = async (id, data) => {
  const res = await axios.put(`${API}/${id}`, data, authHeaders());
  return res.data;
};

export const deleteLessonPlan = async (id) => {
  await axios.delete(`${API}/${id}`, authHeaders());
};
