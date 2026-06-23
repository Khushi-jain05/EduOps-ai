import axios from "axios";

const API = "http://localhost:8000/api/timetable";

export const getTimetable = async () => {
  const token = localStorage.getItem("token");
  const res = await axios.get(API, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

export const createTimetable = async (payload) => {
  const token = localStorage.getItem("token");
  const res = await axios.post(API, payload, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};
