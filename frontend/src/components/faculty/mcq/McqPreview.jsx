import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  FiArrowLeft,
  FiDownload,
  FiShare2,
  FiTrash2,
} from "react-icons/fi";

import Sidebar from "../../../components/layout/Sidebar";
import Navbar from "../../../components/layout/Navbar";

import {
  deleteMcq,
  downloadMcq,
  getMcqById,
  getSharedMcq,
  publishMcq,
} from "../../../services/mcq.service";

const optionLabels = ["A", "B", "C", "D"];

export default function McqPreview({ shared = false }) {
  const { id, token } = useParams();
  const navigate = useNavigate();

  const [mcq, setMcq] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadMcq();
  }, [id, token]);

  const questions = useMemo(() => mcq?.mcq_questions || [], [mcq]);

  const loadMcq = async () => {
    try {
      setLoading(true);
      setError("");
      const data = shared ? await getSharedMcq(token) : await getMcqById(id);
      setMcq(data);
    } catch (err) {
      console.error("Failed to load MCQ", err);
      setMcq(null);
      setError(err.response?.data?.message || "MCQ set not found");
    } finally {
      setLoading(false);
    }
  };

  const getOptions = (question) => {
    if (Array.isArray(question.options)) return question.options;
    return optionLabels.map((label) => question.options?.[label]).filter(Boolean);
  };

  const handleShare = async () => {
    try {
      const updated = await publishMcq(mcq.id);
      setMcq(updated);
      const shareUrl = `${window.location.origin}/mcq/share/${updated.share_token}`;
      await navigator.clipboard?.writeText(shareUrl);
      alert("Share link copied to clipboard");
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Unable to create share link");
    }
  };

  const handleDownload = async () => {
    try {
      const blob = await downloadMcq(mcq.id);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${(mcq.title || "mcq-set")
        .replace(/[^a-z0-9-_]+/gi, "-")
        .toLowerCase()}.txt`;
      link.click();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Unable to download MCQ set");
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Delete this MCQ set permanently?")) return;

    try {
      await deleteMcq(mcq.id);
      navigate("/faculty/mcq");
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Unable to delete MCQ set");
    }
  };

  const body = (
    <div
      style={{
        flex: 1,
        overflowY: "auto",
        padding: "35px",
      }}
    >
      {loading ? (
        <h2>Loading MCQ Set...</h2>
      ) : !mcq ? (
        <div
          style={{
            background: "#fff",
            borderRadius: "8px",
            padding: "28px",
            border: "1px solid #E2E8F0",
          }}
        >
          <h2 style={{ marginTop: 0 }}>MCQ Set Not Found</h2>
          <p style={{ color: "#64748B" }}>{error}</p>
        </div>
      ) : (
        <>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              gap: "18px",
              alignItems: "flex-start",
              marginBottom: "26px",
            }}
          >
            <div>
              {!shared && (
                <button
                  onClick={() => navigate("/faculty/mcq")}
                  style={backButtonStyle}
                >
                  <FiArrowLeft />
                  Back
                </button>
              )}

              <h1
                style={{
                  margin: "16px 0 8px",
                  color: "#0F172A",
                  fontSize: "34px",
                }}
              >
                {mcq.title}
              </h1>

              <div style={{ color: "#475569", fontWeight: 600 }}>
                {mcq.Subject?.code} • {mcq.Subject?.name}
              </div>

              <div
                style={{
                  marginTop: "12px",
                  display: "flex",
                  gap: "10px",
                  flexWrap: "wrap",
                }}
              >
                <Badge>{questions.length} Questions</Badge>
                <Badge>{mcq.difficulty || "Medium"}</Badge>
                <Badge>{mcq.bloom_level || "Understand"}</Badge>
                <Badge>{mcq.status || "draft"}</Badge>
              </div>
            </div>

            {!shared && (
              <div
                style={{
                  display: "flex",
                  gap: "10px",
                  flexWrap: "wrap",
                  justifyContent: "flex-end",
                }}
              >
                <button onClick={handleShare} style={toolbarButtonStyle}>
                  <FiShare2 />
                  Share
                </button>
                <button onClick={handleDownload} style={toolbarButtonStyle}>
                  <FiDownload />
                  Download
                </button>
                <button
                  onClick={handleDelete}
                  style={{
                    ...toolbarButtonStyle,
                    color: "#DC2626",
                    borderColor: "#FECACA",
                  }}
                >
                  <FiTrash2 />
                  Delete
                </button>
              </div>
            )}
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "18px",
            }}
          >
            {questions.length > 0 ? (
              questions.map((q, index) => {
                const options = getOptions(q);
                return (
                  <div
                    key={q.id || index}
                    style={{
                      background: "#fff",
                      padding: "24px",
                      borderRadius: "8px",
                      border: "1px solid #E2E8F0",
                      boxShadow: "0 8px 22px rgba(15,23,42,.05)",
                    }}
                  >
                    <h3
                      style={{
                        margin: "0 0 18px",
                        color: "#0F172A",
                        lineHeight: 1.45,
                      }}
                    >
                      Q{index + 1}. {q.question}
                    </h3>

                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))",
                        gap: "10px",
                      }}
                    >
                      {options.map((option, optionIndex) => {
                        const label = optionLabels[optionIndex];
                        const isCorrect = q.correct_answer === label;
                        return (
                          <div
                            key={`${q.id || index}-${label}`}
                            style={{
                              border: `1px solid ${
                                isCorrect ? "#86EFAC" : "#CBD5E1"
                              }`,
                              background: isCorrect ? "#F0FDF4" : "#F8FAFC",
                              color: "#1E293B",
                              borderRadius: "8px",
                              padding: "12px",
                            }}
                          >
                            <strong>{label}.</strong> {option}
                          </div>
                        );
                      })}
                    </div>

                    <div
                      style={{
                        marginTop: "18px",
                        paddingTop: "16px",
                        borderTop: "1px solid #E2E8F0",
                        color: "#334155",
                      }}
                    >
                      <p style={{ margin: "0 0 8px" }}>
                        <strong>Correct Answer:</strong> {q.correct_answer}
                      </p>
                      <p style={{ margin: "0 0 8px" }}>
                        <strong>Explanation:</strong>{" "}
                        {q.explanation || "No explanation available"}
                      </p>
                      <p style={{ margin: 0 }}>
                        <strong>Marks:</strong> {q.marks || 1}
                      </p>
                    </div>
                  </div>
                );
              })
            ) : (
              <h3>No MCQs Found</h3>
            )}
          </div>
        </>
      )}
    </div>
  );

  if (shared) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "#EEF6FF",
        }}
      >
        {body}
      </div>
    );
  }

  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
        background: "#EEF6FF",
      }}
    >
      <Sidebar />

      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        <Navbar />
        {body}
      </div>
    </div>
  );
}

function Badge({ children }) {
  return (
    <span
      style={{
        background: "#E0F2FE",
        color: "#075985",
        borderRadius: "8px",
        padding: "7px 11px",
        fontSize: "13px",
        fontWeight: 700,
      }}
    >
      {children}
    </span>
  );
}

const backButtonStyle = {
  border: "1px solid #CBD5E1",
  background: "#fff",
  color: "#334155",
  borderRadius: "8px",
  padding: "10px 14px",
  display: "inline-flex",
  alignItems: "center",
  gap: "8px",
  cursor: "pointer",
  fontWeight: 700,
};

const toolbarButtonStyle = {
  border: "1px solid #CBD5E1",
  background: "#fff",
  color: "#2563EB",
  borderRadius: "8px",
  padding: "11px 14px",
  display: "inline-flex",
  alignItems: "center",
  gap: "8px",
  cursor: "pointer",
  fontWeight: 700,
};
