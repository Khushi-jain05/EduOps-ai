import {
  createLecture,
  deleteLecture,
  getLectures,
  updateLecture,
} from "./lecture.service";
import axios from "axios";

const API = "http://localhost:8000/api/lectures";

const authHeaders = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
});

export const createLessonPlan = async (data) => {
  return normalizeLecture(await createLecture(toLecturePayload(data)));
};

export const getLessonPlans = async () => {
  const data = await getLectures();
  return data.map(normalizeLecture);
};

export const getLessonPlanById = async (id) => {
  const res = await axios.get(
    `${API}/${id}`,
    authHeaders()
  );

  return normalizeLecture(res.data);
};

export const updateLessonPlan = async (
  id,
  data
) => {
  return normalizeLecture(await updateLecture(id, toLecturePayload(data)));
};

export const deleteLessonPlan = async (
  id
) => {
  await deleteLecture(id);
};

const dateKey = (value) =>
  typeof value === "string"
    ? value.slice(0, 10)
    : new Date(value).toISOString().slice(0, 10);

const timeAsDate = (value) =>
  value ? `1970-01-01T${value}:00.000Z` : "";

const minutesBetween = (start, end) => {
  if (!start || !end) return "60";

  const startDate = new Date(`1970-01-01T${start}:00`);
  const endDate = new Date(`1970-01-01T${end}:00`);

  return String(Math.max(1, Math.round((endDate - startDate) / 60000)));
};

const addMinutes = (time, minutes) => {
  if (!time) return "";

  const date = new Date(`1970-01-01T${time}:00`);
  date.setMinutes(date.getMinutes() + Number(minutes || 60));

  return date.toISOString().slice(11, 16);
};

const toLecturePayload = (data) => {
  const startTime = data.start_time || data.startTime;
  const endTime =
    data.end_time ||
    data.endTime ||
    addMinutes(startTime, data.duration);

  return {
    subject_id: data.subject_id,
    title: data.title,
    description: data.description || data.notes || "",
    date: dateKey(data.date || data.lesson_date),
    start_time: startTime,
    end_time: endTime,
    classroom: data.classroom || data.room || "",
    meeting_link: data.meeting_link || data.meetingLink || "",
    semester: data.semester || "",
    section: data.section || "",
    branch: data.branch || "",
  };
};

const normalizeLecture = (lecture) => ({
  ...lecture,
  lesson_date: lecture.date,
  start_time: timeAsDate(lecture.start_time),
  end_time: timeAsDate(lecture.end_time),
  room: lecture.classroom || lecture.meeting_link || "",
  topic: lecture.description || "",
  duration: `${minutesBetween(lecture.start_time, lecture.end_time)} mins`,
  status: "active",
  sessions: 1,
  weeks: 1,
});
