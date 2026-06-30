import axios from "axios";

const API = "http://localhost:8000/api/units";

export const getUnitsBySubject = async (subjectId) => {
  const token = localStorage.getItem("token");

  const response = await axios.get(
    `${API}/subject/${subjectId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};
