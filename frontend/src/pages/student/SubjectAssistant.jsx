import Sidebar from "../../components/layout/Sidebar";
import Navbar from "../../components/layout/Navbar";
import { useEffect, useState } from "react";

import SubjectCard from "../../components/subjectAssistant/SubjectCard";
import { getSubjects } from "../../services/subject.service";

import "../../styles/subjectAssistant.css";

export default function SubjectAssistant() {
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSubjects();
  }, []);

  const loadSubjects = async () => {
    try {
      const data = await getSubjects();

      console.log("Subjects:", data);

      setSubjects(data || []);
    } catch (error) {
      console.error("Failed to fetch subjects:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="subject-layout">
      <Sidebar />

      <div className="subject-content">
        <Navbar />

        <div className="subject-wrapper">
          {/* HEADER */}

          <div className="subject-header">
            <span className="subject-pill">
              Subject Assistants
            </span>

            <h1>Pick a subject to start learning</h1>

            <p>
              Each subject has its own AI tutor trained on
              your syllabus, notes and past papers.
            </p>
          </div>

          {/* LOADING */}

          {loading ? (
            <div
              style={{
                textAlign: "center",
                padding: "40px",
              }}
            >
              Loading Subjects...
            </div>
          ) : subjects.length === 0 ? (
            <div
              style={{
                textAlign: "center",
                padding: "40px",
                background: "white",
                borderRadius: "24px",
              }}
            >
              No Subjects Found
            </div>
          ) : (
            <div className="subject-grid">
              {subjects.map((subject) => (
                <SubjectCard
                  key={subject.id}
                  subject={subject}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}