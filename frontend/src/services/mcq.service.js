import axios from "axios";

const API = "http://localhost:8000/api/mcq";

const authHeaders = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
});

export const generateMcq = async (data) => {
  const body = new FormData();

  Object.entries(data).forEach(([key, value]) => {
    if (value === undefined || value === null) return;

    if (key === "contentFile" && value) {
      body.append(key, value);
    } else if (Array.isArray(value)) {
      body.append(key, JSON.stringify(value));
    } else {
      body.append(key, value);
    }
  });

  const response = await axios.post(
    `${API}/generate`,
    body,
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

export const getSharedMcq = async (token) => {
  const response = await axios.get(`${API}/shared/${token}`);

  return response.data;
};

export const downloadMcq = async (id) => {
  const response = await axios.get(
    `${API}/${id}/download`,
    {
      ...authHeaders(),
      responseType: "blob",
    }
  );

  return response.data;
};

export const deleteMcq = async (id) => {
  await axios.delete(
    `${API}/${id}`,
    authHeaders()
  );
};
