import { useEffect, useState } from "react";
import { FiEdit2, FiExternalLink } from "react-icons/fi";

import { getAssignmentById, gradeSubmission } from "../../../services/assignment.service";

const statusColors = {
  pending: { bg: "#F1F5F9", color: "#64748B" },
  submitted: { bg: "#DBEAFE", color: "#1D4ED8" },
  graded: { bg: "#DCFCE7", color: "#15803D" },
};

export default function AssignmentSubmissionsModal({ open, assignmentId, onClose, onChange }) {
  const [assignment, setAssignment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [gradingId, setGradingId] = useState(null);
  const [scoreInput, setScoreInput] = useState("");
  const [feedbackInput, setFeedbackInput] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const load = async () => {
    try {
      setLoading(true);
      const data = await getAssignmentById(assignmentId);
      setAssignment(data);
    } catch (err) {
      console.error("Failed to load submissions", err);
      setAssignment(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open && assignmentId) {
      load();
      setGradingId(null);
      setError("");
    }
  }, [open, assignmentId]);

  if (!open) return null;

  const startGrading = (submission) => {
    setGradingId(submission.id);
    setScoreInput(submission.score !== null ? String(submission.score) : "");
    setFeedbackInput(submission.feedback || "");
    setError("");
  };

  const saveGrade = async (submission) => {
    const score = Number(scoreInput);

    if (!Number.isFinite(score) || score < 0) {
      setError("Enter a valid score.");
      return;
    }

    setSaving(true);
    setError("");

    try {
      await gradeSubmission(assignmentId, submission.student_id, {
        score,
        feedback: feedbackInput,
      });
      setGradingId(null);
      await load();
      await onChange?.();
    } catch (err) {
      console.error("Failed to grade submission", err);
      setError(err.response?.data?.message || "Unable to save grade.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(15,23,42,.45)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 999,
      }}
      onClick={onClose}
    >
      <div
        style={{
          width: "780px",
          background: "#fff",
          borderRadius: "26px",
          padding: "32px",
          maxHeight: "85vh",
          overflowY: "auto",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {loading ? (
          <h2>Loading submissions...</h2>
        ) : !assignment ? (
          <h2>Assignment not found</h2>
        ) : (
          <>
            <div style={{ color: "#2563EB", fontWeight: 700, fontSize: "14px" }}>
              {assignment.Subject?.code} · {assignment.Subject?.name}
            </div>

            <h1 style={{ margin: "6px 0 0", color: "#172554", fontSize: "26px" }}>
              {assignment.title}
            </h1>

            <p style={{ color: "#64748B", marginTop: "8px" }}>
              {assignment.submitted_count}/{assignment.total_students} submitted ·{" "}
              {assignment.graded_count} graded
            </p>

            <div style={{ marginTop: "20px", display: "flex", flexDirection: "column", gap: "12px" }}>
              {(assignment.submissions || []).map((submission) => {
                const colors = statusColors[submission.status] || statusColors.pending;
                const isGrading = gradingId === submission.id;

                return (
                  <div
                    key={submission.id}
                    style={{
                      border: "1px solid #E8EEF7",
                      borderRadius: "18px",
                      padding: "16px 20px",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <div>
                        <div style={{ fontWeight: 700, color: "#172554" }}>
                          {submission.User?.username || "Student"}
                        </div>
                        <div style={{ color: "#64748B", fontSize: "13px" }}>
                          {submission.User?.email}
                        </div>
                      </div>

                      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                        <span
                          style={{
                            background: colors.bg,
                            color: colors.color,
                            padding: "6px 14px",
                            borderRadius: "999px",
                            fontSize: "12px",
                            fontWeight: 700,
                            textTransform: "capitalize",
                          }}
                        >
                          {submission.status}
                        </span>

                        {submission.file_url && (
                          <a
                            href={submission.file_url}
                            target="_blank"
                            rel="noreferrer"
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "6px",
                              color: "#2563EB",
                              fontSize: "13px",
                              fontWeight: 600,
                            }}
                          >
                            View <FiExternalLink size={14} />
                          </a>
                        )}

                        {submission.status !== "pending" && (
                          <button
                            onClick={() => startGrading(submission)}
                            title="Grade submission"
                            style={{
                              border: "1px solid #DDE5F0",
                              background: "#fff",
                              borderRadius: "10px",
                              padding: "8px",
                              cursor: "pointer",
                            }}
                          >
                            <FiEdit2 size={14} />
                          </button>
                        )}
                      </div>
                    </div>

                    {submission.status === "graded" && !isGrading && (
                      <div style={{ marginTop: "10px", fontSize: "14px", color: "#334155" }}>
                        Score: <strong>{submission.score}/{assignment.total_marks}</strong>
                        {submission.feedback && ` — ${submission.feedback}`}
                      </div>
                    )}

                    {isGrading && (
                      <div style={{ marginTop: "14px" }}>
                        {error && (
                          <div style={{ color: "#DC2626", fontSize: "13px", marginBottom: "8px" }}>
                            {error}
                          </div>
                        )}

                        <div style={{ display: "flex", gap: "10px", marginBottom: "10px" }}>
                          <input
                            type="number"
                            min="0"
                            placeholder={`Score out of ${assignment.total_marks}`}
                            value={scoreInput}
                            onChange={(e) => setScoreInput(e.target.value)}
                            style={{
                              width: "160px",
                              padding: "10px 12px",
                              borderRadius: "10px",
                              border: "1px solid #DDE5F0",
                            }}
                          />

                          <input
                            placeholder="Feedback (optional)"
                            value={feedbackInput}
                            onChange={(e) => setFeedbackInput(e.target.value)}
                            style={{
                              flex: 1,
                              padding: "10px 12px",
                              borderRadius: "10px",
                              border: "1px solid #DDE5F0",
                            }}
                          />
                        </div>

                        <div style={{ display: "flex", gap: "10px" }}>
                          <button
                            onClick={() => setGradingId(null)}
                            disabled={saving}
                            style={{
                              padding: "8px 16px",
                              borderRadius: "10px",
                              border: "1px solid #DDE5F0",
                              background: "#fff",
                              cursor: "pointer",
                            }}
                          >
                            Cancel
                          </button>

                          <button
                            onClick={() => saveGrade(submission)}
                            disabled={saving}
                            style={{
                              padding: "8px 16px",
                              borderRadius: "10px",
                              border: "none",
                              background: "#2563EB",
                              color: "#fff",
                              fontWeight: 600,
                              cursor: "pointer",
                              opacity: saving ? 0.7 : 1,
                            }}
                          >
                            {saving ? "Saving..." : "Save Grade"}
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}

              {(!assignment.submissions || assignment.submissions.length === 0) && (
                <div style={{ color: "#64748B", textAlign: "center", padding: "30px" }}>
                  No students matched this assignment yet.
                </div>
              )}
            </div>
          </>
        )}

        <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "24px" }}>
          <button
            onClick={onClose}
            style={{
              padding: "12px 22px",
              borderRadius: "12px",
              border: "1px solid #DDE5F0",
              background: "#fff",
              cursor: "pointer",
              fontWeight: 600,
            }}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
