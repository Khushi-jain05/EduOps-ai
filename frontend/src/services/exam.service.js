import axios from "axios";

const API =
  "http://localhost:8000/api/exams";

export const getExams =
  async () => {

    const token =
      localStorage.getItem("token");

    const res =
      await axios.get(API, {
        headers: {
          Authorization:
            `Bearer ${token}`,
        },
      });

    return res.data;
};

export const downloadExamPdf =
  async () => {

    const token =
      localStorage.getItem("token");

    const response =
      await axios.get(
        `${API}/download`,
        {
          responseType: "blob",
          headers: {
            Authorization:
              `Bearer ${token}`,
          },
        }
      );

    return response.data;
};