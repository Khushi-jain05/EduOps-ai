import { useEffect, useState } from "react";
import { FiUploadCloud, FiFileText, FiZap } from "react-icons/fi";

import { getSubjects } from "../../../services/subject.service";
import {
  createAssignment,
  generateAssignment,
  updateAssignment,
} from "../../../services/assignment.service";

const emptyForm = {
  title: "",
  subject_id: "",
  description: "",
  due_date: "",
  total_marks: "100",
  status: "active",
  semester: "",
  section: "",
  branch: "",
};

const input = {
  width: "100%",
  padding: "14px",
  borderRadius: "14px",
  border: "1px solid #DDE5F0",
  marginTop: "8px",
  marginBottom: "18px",
  fontSize: "15px",
};

export default function CreateAssignmentModal({ open, onClose, onSuccess, assignment }) {
  const [subjects, setSubjects] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [topic, setTopic] = useState("");
  const [contentFile, setContentFile] = useState(null);
  const [generating, setGenerating] = useState(false);
  const [generateError, setGenerateError] = useState("");

  const isEditing = Boolean(assignment);

  useEffect(() => {
    if (!open) return;

    getSubjects()
      .then(setSubjects)
      .catch((err) => console.error("Failed to load subjects", err));

    setForm(
      assignment
        ? {
            title: assignment.title || "",
            subject_id: assignment.subject_id || "",
            description: assignment.description || "",
            due_date: assignment.due_date ? assignment.due_date.slice(0, 10) : "",
            total_marks: String(assignment.total_marks || 100),
            status: assignment.status || "active",
            semester: assignment.semester || "",
            section: assignment.section || "",
            branch: assignment.branch || "",
          }
        : emptyForm
    );
    setError("");
    setTopic("");
    setContentFile(null);
    setGenerateError("");
  }, [open, assignment]);

  const setField = (field) => (e) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const handleGenerate = async () => {
    if (!form.subject_id) {
      setGenerateError("Select a subject first.");
      return;
    }

    if (!topic && !contentFile) {
      setGenerateError("Enter a topic or upload a PDF/PPT/file to generate from.");
      return;
    }

    setGenerating(true);
    setGenerateError("");

    try {
      const draft = await generateAssignment({
        subject_id: form.subject_id,
        topic,
        contentFile,
      });

      setForm((prev) => ({
        ...prev,
        title: draft.title || prev.title,
        description: draft.description || prev.description,
        total_marks: String(draft.total_marks || prev.total_marks),
      }));
    } catch (err) {
      console.error("Failed to generate assignment", err);
      setGenerateError(
        err.response?.data?.message || "Unable to generate assignment content."
      );
    } finally {
      setGenerating(false);
    }
  };

  const handleSave = async () => {
    if (!form.title || !form.subject_id || !form.due_date) {
      setError("Please fill title, subject and due date.");
      return;
    }

    setSaving(true);
    setError("");

    try {
      if (isEditing) {
        await updateAssignment(assignment.id, form);
      } else {
        await createAssignment(form);
      }

      await onSuccess?.();
      onClose();
    } catch (err) {
      console.error("Failed to save assignment", err);
      setError(
        err.response?.data?.message || "Unable to save assignment. Please try again."
      );
    } finally {
      setSaving(false);
    }
  };

  if (!open) return null;

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
    >
      <div
        style={{
          width: "620px",
          background: "#fff",
          borderRadius: "26px",
          padding: "35px",
          maxHeight: "90vh",
          overflowY: "auto",
        }}
      >
        <h1 style={{ marginTop: 0, color: "#172554" }}>
          {isEditing ? "Edit Assignment" : "New Assignment"}
        </h1>

        <p style={{ color: "#64748B", marginBottom: "25px" }}>
          This assignment will appear immediately on matching students' portals.
        </p>

        {error && (
          <div
            style={{
              background: "#FEF2F2",
              color: "#DC2626",
              padding: "12px 16px",
              borderRadius: "12px",
              marginBottom: "18px",
              fontSize: "14px",
            }}
          >
            {error}
          </div>
        )}

        <label>Subject</label>
        <select style={input} value={form.subject_id} onChange={setField("subject_id")}>
          <option value="">Select Subject</option>
          {subjects.map((s) => (
            <option key={s.id} value={s.id}>
              {s.code} - {s.name}
            </option>
          ))}
        </select>

        <div
          style={{
            background: "#F8FBFF",
            border: "1px dashed #93C5FD",
            borderRadius: "16px",
            padding: "18px",
            marginBottom: "18px",
          }}
        >
          <div style={{ fontWeight: 600, color: "#172554", marginBottom: "10px" }}>
            Generate with AI (RAG)
          </div>

          <p style={{ color: "#64748B", fontSize: "13px", marginBottom: "12px" }}>
            Upload lecture notes as a PDF, PPT or text file, or just enter a topic —
            the assignment title and instructions will be drafted from that content
            for you to review before saving.
          </p>

          {generateError && (
            <div style={{ color: "#DC2626", fontSize: "13px", marginBottom: "10px" }}>
              {generateError}
            </div>
          )}

          <input
            placeholder="Topic (optional if uploading a file)"
            style={{ ...input, marginBottom: "10px" }}
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
          />

          <label
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              border: "1px solid #DDE5F0",
              borderRadius: "14px",
              padding: "12px 14px",
              cursor: "pointer",
              marginBottom: "12px",
              background: "#fff",
            }}
          >
            {contentFile ? <FiFileText /> : <FiUploadCloud />}
            <span style={{ fontSize: "14px", color: "#334155" }}>
              {contentFile ? contentFile.name : "Upload PDF / PPTX / TXT (optional)"}
            </span>
            <input
              type="file"
              accept=".pdf,.pptx,.txt,.md,.csv,.html"
              style={{ display: "none" }}
              onChange={(e) => setContentFile(e.target.files?.[0] || null)}
            />
          </label>

          <button
            onClick={handleGenerate}
            disabled={generating}
            style={{
              border: "none",
              borderRadius: "12px",
              background: "#1D4ED8",
              color: "#fff",
              padding: "12px 20px",
              fontWeight: 600,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "8px",
              opacity: generating ? 0.7 : 1,
            }}
          >
            <FiZap />
            {generating ? "Generating..." : "Generate with AI"}
          </button>
        </div>

        <label>Title</label>
        <input style={input} value={form.title} onChange={setField("title")} />

        <label>Description</label>
        <textarea
          rows={4}
          style={input}
          value={form.description}
          onChange={setField("description")}
        />

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
          <div>
            <label>Due Date</label>
            <input
              type="date"
              style={input}
              value={form.due_date}
              onChange={setField("due_date")}
            />
          </div>

          <div>
            <label>Total Marks</label>
            <input
              type="number"
              min="1"
              style={input}
              value={form.total_marks}
              onChange={setField("total_marks")}
            />
          </div>
        </div>

        <label>Status</label>
        <select style={input} value={form.status} onChange={setField("status")}>
          <option value="active">Live</option>
          <option value="draft">Draft</option>
        </select>

        <div
          style={{
            fontSize: "13px",
            color: "#64748B",
            marginBottom: "8px",
          }}
        >
          Targeting (optional) — leave blank to send to <strong>all students</strong>.
          Only fill these to restrict the assignment to a specific
          semester/section/branch (values must exactly match student profiles).
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "12px" }}>
          <div>
            <label>Semester</label>
            <input style={input} value={form.semester} onChange={setField("semester")} />
          </div>

          <div>
            <label>Section</label>
            <input style={input} value={form.section} onChange={setField("section")} />
          </div>

          <div>
            <label>Branch</label>
            <input style={input} value={form.branch} onChange={setField("branch")} />
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            gap: "15px",
            marginTop: "25px",
          }}
        >
          <button
            onClick={onClose}
            disabled={saving}
            style={{ padding: "12px 24px", borderRadius: "12px" }}
          >
            Cancel
          </button>

          <button
            onClick={handleSave}
            disabled={saving}
            style={{
              background: "#2563EB",
              color: "#fff",
              border: "none",
              borderRadius: "12px",
              padding: "12px 26px",
              opacity: saving ? 0.7 : 1,
            }}
          >
            {saving ? "Saving..." : isEditing ? "Update Assignment" : "Create Assignment"}
          </button>
        </div>
      </div>
    </div>
  );
}
