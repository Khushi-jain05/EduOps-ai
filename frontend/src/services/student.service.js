import axios from "axios";

const API_URL =
  "http://localhost:8000/api/student";

export const getDashboard = async () => {
  const token =
    localStorage.getItem("token");

  const response = await axios.get(
    `${API_URL}/dashboard`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};