import axios from "axios";

const API =
"http://localhost:8000/api/timetable";

export const getTimetable =
async () => {

  const token =
  localStorage.getItem("token");

  const res = await axios.get(
    API,
    {
      headers: {
        Authorization:
        `Bearer ${token}`,
      },
    }
  );

  return res.data;
};