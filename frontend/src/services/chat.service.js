import axios from "axios";

export const sendMessage = async (
  message
) => {
  const token =
    localStorage.getItem("token");

  const response =
    await axios.post(
      "http://localhost:8000/api/chat/send",
      { message },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

  return response.data;
};