import { useEffect, useState } from "react";

import { submitAssignment } from "../../services/assignment.service";

export default function SubmitAssignmentModal({ open, assignment, onClose, onSuccess }) {
  const [link, setLink] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (open) {
      setLink("");
      setError("");
    }
  }, [open, assignment]);

  if (!open || !assignment) return null;

  const handleSubmit = async () => {
    if (!link.trim()) {
      setError("Paste a link to your work (Drive, GitHub, etc.).");
      return;
    }

    setSaving(true);
    setError("");

    try {
      await submitAssignment(assignment.assignment_id, { file_url: link.trim() });
      await onSuccess?.();
      onClose();
    } catch (err) {
      console.error("Failed to submit assignment", err);
      setError(err.response?.data?.message || "Unable to submit. Please try again.");
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
        zIndex: 1000,
      }}
      onClick={onClose}
    >
      <div
        style={{
          width: "460px",
          background: "#fff",
          borderRadius: "24px",
          padding: "28px",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <h2 style={{ margin: 0, color: "#172554" }}>Submit Assignment</h2>

        <p style={{ color: "#64748B", fontSize: "14px", marginTop: "8px" }}>
          {assignment.title}
        </p>

        {error && (
          <div
            style={{
              background: "#FEF2F2",
              color: "#DC2626",
              padding: "10px 14px",
              borderRadius: "10px",
              fontSize: "13px",
              margin: "14px 0",
            }}
          >
            {error}
          </div>
        )}

        <label style={{ display: "block", marginTop: "16px", fontWeight: 600 }}>
          Submission link
        </label>

        <input
          autoFocus
          placeholder="https://drive.google.com/..."
          value={link}
          onChange={(e) => setLink(e.target.value)}
          style={{
            width: "100%",
            padding: "12px 14px",
            borderRadius: "12px",
            border: "1px solid #DDE5F0",
            marginTop: "8px",
            fontSize: "14px",
          }}
        />

        <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px", marginTop: "22px" }}>
          <button
            onClick={onClose}
            disabled={saving}
            style={{
              padding: "12px 20px",
              borderRadius: "12px",
              border: "1px solid #DDE5F0",
              background: "#fff",
              cursor: "pointer",
              fontWeight: 600,
            }}
          >
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            disabled={saving}
            style={{
              padding: "12px 20px",
              borderRadius: "12px",
              border: "none",
              background: "#2563EB",
              color: "#fff",
              cursor: "pointer",
              fontWeight: 600,
              opacity: saving ? 0.7 : 1,
            }}
          >
            {saving ? "Submitting..." : "Submit"}
          </button>
        </div>
      </div>
    </div>
  );
}
