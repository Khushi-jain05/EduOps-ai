import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FiArrowLeft, FiBookOpen, FiCalendar, FiClock } from "react-icons/fi";
import {
  updateLesson,
  deleteLessonPlan,
} from "../../services/lessonPlan.service";
import Navbar from "../../components/layout/Navbar";
import Sidebar from "../../components/layout/Sidebar";
import { getLessonPlanById } from "../../services/lessonPlan.service";

export default function LessonDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
const [editing, setEditing] = useState(false);

const [form, setForm] = useState({});
  const [lesson, setLesson] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadLesson();
  }, []);
useEffect(() => {
  if (lesson) {
    setForm({
      title: lesson.title,
      topic: lesson.topic,
      objectives: lesson.objectives,
      notes: lesson.notes,
      room: lesson.room,
      duration: lesson.duration,
      status: lesson.status,
    });
  }
}, [lesson]);
  const loadLesson = async () => {
    try {
      const data = await getLessonPlanById(id);
      setLesson(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  const handleSave = async () => {
  try {
    await updateLesson(id, form);

    await loadLesson();

    setEditing(false);

    alert("Lesson updated successfully");
  } catch (err) {
    console.error(err);

    alert("Failed to update lesson");
  }
};

const handleDelete = async () => {
  const confirmDelete = window.confirm(
    "Are you sure you want to delete this lesson?"
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
          <button
            onClick={() => navigate(-1)}
            style={{
              border: "none",
              background: "#fff",
              padding: "12px 18px",
              borderRadius: 12,
              cursor: "pointer",
              marginBottom: 25,
            }}
          >
            <FiArrowLeft /> Back
          </button>
          <div
  style={{
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 25,
  }}
>
  <button
    onClick={() => navigate(-1)}
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

  <div
    style={{
      display: "flex",
      gap: 15,
    }}
  >
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
          Delete Lesson
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
              <h1>{lesson.title}</h1>

              <p>{lesson.topic}</p>

              <hr />

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 25,
                  marginTop: 25,
                }}
              >
                <div>
                  <h3>Subject</h3>
                  <p>{lesson.Subject?.name}</p>
                </div>

                <div>
                  <h3>Status</h3>
                  <p>{lesson.status}</p>
                </div>

                <div>
                  <h3>
                    <FiCalendar /> Date
                  </h3>

                  <p>
                    {new Date(
                      lesson.lesson_date
                    ).toLocaleDateString()}
                  </p>
                </div>

                <div>
                  <h3>
                    <FiClock /> Time
                  </h3>

                  <p>
                    {new Date(
                      lesson.start_time
                    ).toLocaleTimeString()}
                  </p>
                </div>

                <div>
                  <h3>Room</h3>

                  <p>{lesson.room}</p>
                </div>

                <div>
                  <h3>Duration</h3>

                  <p>{lesson.duration} mins</p>
                </div>
              </div>

              <div
                style={{
                  marginTop: 35,
                }}
              >
                <h2>
                  <FiBookOpen /> Objectives
                </h2>

                <p>{lesson.objectives}</p>
              </div>

              <div
                style={{
                  marginTop: 35,
                }}
              >
                <h2>Notes</h2>

                <p>{lesson.notes}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}