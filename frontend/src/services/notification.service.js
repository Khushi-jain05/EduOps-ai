import axios from "axios";

const API = "http://localhost:8000/api/notifications";

const authHeaders = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
});

export const getNotifications = async () => {
  const res = await axios.get(API, authHeaders());
  return res.data;
};

export const markNotificationRead = async (id) => {
  const res = await axios.patch(
    `${API}/${id}/read`,
    {},
    authHeaders()
  );
  return res.data;
};

export const markAllNotificationsRead = async () => {
  const res = await axios.patch(
    `${API}/read-all`,
    {},
    authHeaders()
  );
  return res.data;
};

export const deleteNotification = async (id) => {
  const res = await axios.delete(
    `${API}/${id}`,
    authHeaders()
  );
  return res.data;
};

export const clearNotifications = async () => {
  const res = await axios.delete(API, authHeaders());
  return res.data;
};
