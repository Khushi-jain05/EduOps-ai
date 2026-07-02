import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FiArrowLeft, FiBookOpen, FiCalendar, FiClock } from "react-icons/fi";

import Navbar from "../../components/layout/Navbar";
import Sidebar from "../../components/layout/Sidebar";
import { getLessonPlanById } from "../../services/lessonPlan.service";

export default function LessonDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [lesson, setLesson] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadLesson();
  }, []);

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