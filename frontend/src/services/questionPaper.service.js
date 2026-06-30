import axios from "axios";

const API = "http://localhost:8000/api/question-paper";

export const createQuestionPaper = async (data) => {
  const response = await axios.post(`${API}/generate`, data);
  return response.data;
};

export const getQuestionPapers = async () => {
  const response = await axios.get(API);
  return response.data;
};

export const deleteQuestionPaper = async (id) => {
  await axios.delete(`${API}/${id}`);
};