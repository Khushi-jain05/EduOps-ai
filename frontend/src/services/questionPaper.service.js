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

export const updateQuestionPaperPublishStatus = async (
  id,
  publish
) => {
  const response = await axios.patch(
    `${API}/${id}/publish`,
    { publish },
    authHeaders()
  );
  return response.data;
};

export const downloadQuestionPaper = async (id) => {
  const response = await axios.get(`${API}/${id}/download`, {
    ...authHeaders(),
    responseType: "blob",
  });
  return response.data;
};

export const deleteQuestionPaper = async (id) => {
  await axios.delete(`${API}/${id}`, authHeaders());
};
