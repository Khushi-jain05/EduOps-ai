import axios from "axios";

const API =
  "http://localhost:8000/api/assignments";

export const getAssignments =
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

export const createAssignment =
  async (payload) => {

    const token =
      localStorage.getItem("token");

    const res =
      await axios.post(
        API,
        payload,
        {
          headers: {
            Authorization:
              `Bearer ${token}`,
          },
        }
      );

    return res.data;
};