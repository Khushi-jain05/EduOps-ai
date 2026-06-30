import axios from "axios";

const API = "http://localhost:8000/api/mcq";

const authHeaders = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
});

export const generateMcq = async (data) => {
  const response = await axios.post(
    `${API}/generate`,
    data,
    authHeaders()
  );

  return response.data;
};

export const getMcqSets = async () => {
  const response = await axios.get(
    API,
    authHeaders()
  );

  return response.data;
};

export const publishMcq = async (id) => {
  const response = await axios.patch(
    `${API}/${id}/publish`,
    {},
    authHeaders()
  );

  return response.data;
};

export const getMcqById = async (id) => {
  const response = await axios.get(
    `${API}/${id}`,
    authHeaders()
  );

  return response.data;
};

export const deleteMcq = async (id) => {
  await axios.delete(
    `${API}/${id}`,
    authHeaders()
  );
};