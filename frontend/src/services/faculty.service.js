import axios from "axios";

const API = "http://localhost:8000/api/faculty";

const authHeaders = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
});

export const getFacultyDashboard = async () => {
  const res = await axios.get(
    `${API}/dashboard`,
    authHeaders()
  );

  return res.data;
};
