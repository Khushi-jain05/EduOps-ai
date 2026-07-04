import axios from "axios";

const API = "http://localhost:8000/api/lectures";

const authHeaders = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
});

export const createLecture = async (data) => {
  const res = await axios.post(API, data, authHeaders());
  return res.data;
};

export const getLectures = async () => {
  const res = await axios.get(API, authHeaders());
  return res.data;
};

export const getStudentLectures = async (studentId) => {
  const res = await axios.get(
    `${API}/student/${studentId}`,
    authHeaders()
  );

  return res.data;
};

export const updateLecture = async (id, data) => {
  const res = await axios.put(`${API}/${id}`, data, authHeaders());
  return res.data;
};

export const deleteLecture = async (id) => {
  await axios.delete(`${API}/${id}`, authHeaders());
};
