import axios from "axios";

const API_URL = "http://localhost:8000/api/auth";


export const registerUser = async (userData) => {
  try {
    const response = await axios.post(
      `${API_URL}/register`,
      userData
    );

    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};


export const loginUser = async (userData) => {
  try {
    const response = await axios.post(
      `${API_URL}/login`,
      userData
    );

   
    if (response.data.token) {
      localStorage.setItem(
        "token",
        response.data.token
      );
    }

    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};


export const getCurrentUser = async () => {
  try {
    const token = localStorage.getItem("token");

    const response = await axios.get(
      `${API_URL}/me`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};


export const logoutUser = () => {
  localStorage.removeItem("token");
};


export const isAuthenticated = () => {
  return !!localStorage.getItem("token");
};
