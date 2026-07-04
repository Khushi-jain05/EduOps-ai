import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  FiArrowLeft,
  FiBookOpen,
  FiCalendar,
  FiClock,
  FiTrash2,
} from "react-icons/fi";

import Navbar from "../../components/layout/Navbar";
import Sidebar from "../../components/layout/Sidebar";
import {
  deleteLessonPlan,
  getLessonPlanById,
  updateLessonPlan,
} from "../../services/lessonPlan.service";

const toDateInput = (value) =>
  value ? value.toString().slice(0, 10) : "";

const toTimeInput = (value) =>
  value ? value.toString().slice(11, 16) : "";

export default function LessonDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({});
  const [lesson, setLesson] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadLesson = async () => {
    try {
      setLoading(true);
      const data = await getLessonPlanById(id);
      setLesson(data);
    } catch (err) {
      console.error(err);
      setLesson(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLesson();
  }, [id]);

  useEffect(() => {
    if (lesson) {
      setForm({
        title: lesson.title || "",
        subject_id: lesson.subject_id || "",
        topic: lesson.topic || "",
        description: lesson.description || "",
        objectives: lesson.objectives || "",
        notes: lesson.notes || "",
        room: lesson.room || "",
        duration: lesson.duration || "60",
        status: lesson.status || "active",
        lesson_date: toDateInput(lesson.lesson_date),
        start_time: toTimeInput(lesson.start_time),
        end_time: toTimeInput(lesson.end_time),
        day: lesson.day || "",
        sessions: lesson.sessions || 1,
        weeks: lesson.weeks || 1,
      });
    }
  }, [lesson]);

  const updateForm = (key, value) => {
    setForm((current) => ({
      ...current,
      [key]: value,
    }));
  };

  const handleSave = async () => {
    try {
      const day = form.lesson_date
        ? new Date(form.lesson_date).toLocaleDateString("en-US", {
            weekday: "long",
          })
        : form.day;

      await updateLessonPlan(id, {
        ...form,
        day,
      });

      await loadLesson();
      setEditing(false);
      alert("Lesson updated successfully");
    } catch (err) {
      console.error(err);
      alert(
        err.response?.data?.message ||
          "Failed to update lesson"
      );
    }
  };

  const handleDelete = async () => {
    const confirmDelete = window.confirm(
      "Delete this lesson? It will also be removed from student timetables."
    );

    if (!confirmDelete) return;

    try {
      await deleteLessonPlan(id);
      alert("Lesson deleted successfully");
      navigate("/faculty/lesson-plan");
    } catch (err) {
      console.error(err);
      alert("Failed to delete lesson");
    }
  };

  const inputStyle = {
    width: "100%",
    border: "1px solid #DDE5F0",
    borderRadius: 12,
    padding: "12px 14px",
    fontSize: 15,
  };

  const fieldValue = (value) => value || "Not set";

  return (
    <div
      style={{
        display: "flex",
        background: "#EEF6FF",
        minHeight: "100vh",
      }}
    >
      <Sidebar />

      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Navbar />

        <div style={{ padding: 35 }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 25,
            }}
          >
            <button
              onClick={() => navigate("/faculty/lesson-plan")}
              style={{
                border: "none",
                background: "#fff",
                padding: "12px 18px",
                borderRadius: 12,
                cursor: "pointer",
                fontWeight: 600,
              }}
            >
              <FiArrowLeft /> Back
            </button>

            {lesson && (
              <div style={{ display: "flex", gap: 15 }}>
                {!editing ? (
                  <>
                    <button
                      onClick={() => setEditing(true)}
                      style={{
                        background: "#2563EB",
                        color: "#fff",
                        border: "none",
                        padding: "12px 22px",
                        borderRadius: 12,
                        cursor: "pointer",
                        fontWeight: 600,
                      }}
                    >
                      Edit Lesson
                    </button>

                    <button
                      onClick={handleDelete}
                      style={{
                        background: "#EF4444",
                        color: "#fff",
                        border: "none",
                        padding: "12px 22px",
                        borderRadius: 12,
                        cursor: "pointer",
                        fontWeight: 600,
                      }}
                    >
                      <FiTrash2 /> Delete Lesson
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => {
                        setEditing(false);
                        loadLesson();
                      }}
                      style={{
                        background: "#CBD5E1",
                        border: "none",
                        padding: "12px 22px",
                        borderRadius: 12,
                        cursor: "pointer",
                        fontWeight: 600,
                      }}
                    >
                      Cancel
                    </button>

                    <button
                      onClick={handleSave}
                      style={{
                        background: "#16A34A",
                        color: "#fff",
                        border: "none",
                        padding: "12px 22px",
                        borderRadius: 12,
                        cursor: "pointer",
                        fontWeight: 600,
                      }}
                    >
                      Save Changes
                    </button>
                  </>
                )}
              </div>
            )}
          </div>

          {loading ? (
            <h2>Loading...</h2>
          ) : !lesson ? (
            <h2>Lesson not found</h2>
          ) : (
            <div
              style={{
                background: "#fff",
                borderRadius: 24,
                padding: 35,
              }}
            >
              {editing ? (
                <>
                  <input
                    style={{
                      ...inputStyle,
                      fontSize: 28,
                      fontWeight: 700,
                      color: "#172554",
                    }}
                    value={form.title}
                    onChange={(e) =>
                      updateForm("title", e.target.value)
                    }
                  />

                  <textarea
                    rows={3}
                    style={{
                      ...inputStyle,
                      marginTop: 16,
                    }}
                    value={form.topic}
                    onChange={(e) =>
                      updateForm("topic", e.target.value)
                    }
                  />
                </>
              ) : (
                <>
                  <h1>{lesson.title}</h1>
                  <p>{lesson.topic}</p>
                </>
              )}

              <hr />

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 25,
                  marginTop: 25,
                }}
              >
                <ReadOnlyField
                  label="Subject"
                  value={lesson.Subject?.name}
                />

                <EditableField
                  editing={editing}
                  label="Status"
                  value={form.status}
                  onChange={(value) => updateForm("status", value)}
                  style={inputStyle}
                />

                <EditableField
                  editing={editing}
                  label={
                    <>
                      <FiCalendar /> Date
                    </>
                  }
                  type="date"
                  value={form.lesson_date}
                  viewValue={toDateInput(lesson.lesson_date)}
                  onChange={(value) =>
                    updateForm("lesson_date", value)
                  }
                  style={inputStyle}
                />

                <EditableField
                  editing={editing}
                  label={
                    <>
                      <FiClock /> Time
                    </>
                  }
                  type="time"
                  value={form.start_time}
                  viewValue={toTimeInput(lesson.start_time)}
                  onChange={(value) =>
                    updateForm("start_time", value)
                  }
                  style={inputStyle}
                />

                <EditableField
                  editing={editing}
                  label="End Time"
                  type="time"
                  value={form.end_time}
                  viewValue={toTimeInput(lesson.end_time)}
                  onChange={(value) =>
                    updateForm("end_time", value)
                  }
                  style={inputStyle}
                />

                <EditableField
                  editing={editing}
                  label="Room"
                  value={form.room}
                  viewValue={fieldValue(lesson.room)}
                  onChange={(value) => updateForm("room", value)}
                  style={inputStyle}
                />
              </div>

              <EditableTextArea
                editing={editing}
                icon={<FiBookOpen />}
                label="Objectives"
                value={form.objectives}
                viewValue={fieldValue(lesson.objectives)}
                onChange={(value) =>
                  updateForm("objectives", value)
                }
                style={inputStyle}
              />

              <EditableTextArea
                editing={editing}
                label="Notes"
                value={form.notes}
                viewValue={fieldValue(lesson.notes)}
                onChange={(value) => updateForm("notes", value)}
                style={inputStyle}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function ReadOnlyField({ label, value }) {
  return (
    <div>
      <h3>{label}</h3>
      <p>{value || "Not set"}</p>
    </div>
  );
}

function EditableField({
  editing,
  label,
  type = "text",
  value,
  viewValue,
  onChange,
  style,
}) {
  return (
    <div>
      <h3>{label}</h3>
      {editing ? (
        <input
          type={type}
          style={style}
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      ) : (
        <p>{viewValue || value || "Not set"}</p>
      )}
    </div>
  );
}

function EditableTextArea({
  editing,
  icon,
  label,
  value,
  viewValue,
  onChange,
  style,
}) {
  return (
    <div style={{ marginTop: 35 }}>
      <h2>
        {icon} {label}
      </h2>
      {editing ? (
        <textarea
          rows={5}
          style={style}
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      ) : (
        <p>{viewValue}</p>
      )}
    </div>
  );
}
