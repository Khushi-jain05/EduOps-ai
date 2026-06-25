import Sidebar from "../../components/layout/Sidebar";
import Navbar from "../../components/layout/Navbar";

import { useEffect, useState } from "react";

import {
  getExams,
  downloadExamPdf,
} from "../../services/exam.service";

import {
  Calendar,
  Clock3,
  MapPin,
  Download,
} from "lucide-react";

import "../../styles/exams.css";

export default function Exams() {
  const [activeTab, setActiveTab] =
    useState("upcoming");

  const [exams, setExams] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    loadExams();
  }, []);

  const loadExams = async () => {
    try {
      const data =
        await getExams();

      console.log(
        "Exams:",
        data
      );

      setExams(data || []);
    } catch (error) {
      console.error(
        "Failed to fetch exams:",
        error
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadPdf =
    async () => {
      try {
        const blob =
          await downloadExamPdf();

        const url =
          window.URL.createObjectURL(
            blob
          );

        const link =
          document.createElement(
            "a"
          );

        link.href = url;

        link.download =
          "Exam-Timetable.pdf";

        document.body.appendChild(
          link
        );

        link.click();

        link.remove();

        window.URL.revokeObjectURL(
          url
        );
      } catch (error) {
        console.error(error);
      }
    };

  const getCardColor = (
    subject
  ) => {
    const value =
      subject?.toLowerCase();

    if (
      value?.includes("math")
    )
      return "blue";

    if (
      value?.includes(
        "computer"
      )
    )
      return "purple";

    if (
      value?.includes(
        "physics"
      )
    )
      return "yellow";

    return "blue";
  };

  const filteredExams =
    exams.filter(
      (exam) => {
        if (
          activeTab ===
          "upcoming"
        ) {
          return (
            exam.status?.toLowerCase() ===
            "upcoming"
          );
        }

        return (
          exam.status?.toLowerCase() ===
          "past"
        );
      }
    );

  const nextExam =
    exams.find(
      (exam) =>
        exam.status?.toLowerCase() ===
        "upcoming"
    ) || null;

  return (
    <div className="exam-layout">
      <Sidebar />

      <div className="exam-content">
        <Navbar />

        <div className="exam-wrapper">

          {/* HEADER */}

          <div className="exam-header">

            <div className="exam-header-left">

              <span className="exam-label">
                Exam Center
              </span>

              <h1>Exams</h1>

              <p>
                Schedule,
                hall tickets,
                syllabus and your
                results — all in
                one view.
              </p>

            </div>

            <div className="header-actions">

              <button className="ticket-btn">
                Hall Ticket
              </button>

              <button
                className="download-btn"
                onClick={
                  handleDownloadPdf
                }
              >
                <Download
                  size={18}
                />
                Download timetable PDF
              </button>

            </div>

          </div>

          {/* STATS */}

          <div className="exam-stats">

            <div className="stat-card">

              <p>Next exam</p>

              <h3>
                {nextExam?.subject ||
                  "No Upcoming Exam"}
              </h3>

              <span>
                {nextExam
                  ? `${new Date(
                      nextExam.examDate
                    ).toLocaleDateString()} · ${
                      nextExam.examTime
                    }`
                  : ""}
              </span>

              <div className="blue-text">
                Upcoming
              </div>

            </div>

            <div className="stat-card">

              <p>CGPA</p>

              <div className="cgpa-score">

                <span className="cgpa-number">
                  8.74
                </span>

                <span className="cgpa-growth">
                  ↗ +0.21
                </span>

              </div>

              <div className="progress-bar">
                <div className="progress-fill" />
              </div>

            </div>

            <div className="stat-card">

              <p>This term</p>

              <h2>
                {exams.length} Exams
              </h2>

              <div className="term-info">
                
                <span>
                  Exams Scheduled
                </span>
              </div>

            </div>

          </div>

          {/* TABS */}

          <div className="exam-tabs">

            <button
              className={
                activeTab ===
                "upcoming"
                  ? "active"
                  : ""
              }
              onClick={() =>
                setActiveTab(
                  "upcoming"
                )
              }
            >
              Upcoming
            </button>

            <button
              className={
                activeTab ===
                "past"
                  ? "active"
                  : ""
              }
              onClick={() =>
                setActiveTab(
                  "past"
                )
              }
            >
              Past
            </button>

          </div>

          {/* EXAMS */}

          {loading ? (
            <div
              style={{
                textAlign:
                  "center",
                padding:
                  "40px",
              }}
            >
              Loading exams...
            </div>
          ) : filteredExams.length ===
            0 ? (
            <div
              style={{
                textAlign:
                  "center",
                padding:
                  "40px",
                background:
                  "white",
                borderRadius:
                  "24px",
              }}
            >
              No {activeTab} exams found
            </div>
          ) : (
            <div className="exam-grid">

              {filteredExams.map(
                (exam) => (
                  <div
                    key={exam.id}
                    className={`exam-card ${getCardColor(
                      exam.subject
                    )}`}
                  >

                    <div className="duration">
                      <span>
                        {
                          exam.duration
                        }
                      </span>
                    </div>

                    <span className="exam-code">
                      {exam.code} ·{" "}
                      {exam.type}
                    </span>

                    <h3>
                      {
                        exam.subject
                      }
                    </h3>

                    <div className="exam-row">

                      <div>
                        <Calendar
                          size={
                            16
                          }
                        />

                        {new Date(
                          exam.examDate
                        ).toLocaleDateString()}
                      </div>

                      <div>
                        <Clock3
                          size={
                            16
                          }
                        />

                        {
                          exam.examTime
                        }
                      </div>

                    </div>

                    <div className="exam-location">
                      <MapPin
                        size={
                          16
                        }
                      />

                      {
                        exam.venue
                      }
                    </div>

                  </div>
                )
              )}

            </div>
          )}

        </div>
      </div>
    </div>
  );
}