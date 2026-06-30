import axios from "axios";

const API = "http://localhost:8000/api/question-paper";

const authHeaders = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
});

export const createQuestionPaper = async (data) => {
  const response = await axios.post(
    `${API}/generate`,
    data,
    authHeaders()
  );
  return response.data;
};

export const getQuestionPapers = async () => {
  const response = await axios.get(API, authHeaders());
  return response.data;
};

export const deleteQuestionPaper = async (id) => {
  await axios.delete(`${API}/${id}`, authHeaders());
};
