import { useEffect, useState } from "react";
import { FiFileText, FiUploadCloud, FiX } from "react-icons/fi";

import { getSubjects } from "../../../services/subject.service";
import { getUnitsBySubject } from "../../../services/unit.service";
import { generateMcq } from "../../../services/mcq.service";

const initialForm = {
  title: "",
  subject: "",
  topic: "",
  difficulty: "Medium",
  bloomLevel: "Understand",
  questionCount: 10,
  contentFile: null,
};

export default function GenerateMcqModal({ open, onClose, onSuccess }) {
  const [subjects, setSubjects] = useState([]);
  const [units, setUnits] = useState([]);
  const [selectedUnits, setSelectedUnits] = useState([]);
  const [formData, setFormData] = useState(initialForm);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (open) {
      loadSubjects();
      setError("");
    }
  }, [open]);

  useEffect(() => {
    if (formData.subject) {
      loadUnits(formData.subject);
    } else {
      setUnits([]);
      setSelectedUnits([]);
    }
  }, [formData.subject]);

  const loadSubjects = async () => {
    try {
      const data = await getSubjects();
      setSubjects(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      setSubjects([]);
    }
  };

  const loadUnits = async (subjectId) => {
    try {
      const data = await getUnitsBySubject(subjectId);
      setUnits(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      setUnits([]);
    }
  };

  const closeModal = (force = false) => {
    if (generating && !force) return;
    setFormData(initialForm);
    setSelectedUnits([]);
    setError("");
    onClose();
  };

  const handleGenerate = async () => {
    try {
      setGenerating(true);
      setError("");

      const created = await generateMcq({
        title: formData.title,
        subjectId: formData.subject,
        topic: formData.topic,
        difficulty: formData.difficulty,
        bloomLevel: formData.bloomLevel,
        questionCount: Number(formData.questionCount),
        selectedUnits,
        contentFile: formData.contentFile,
      });

      if (onSuccess) {
        await onSuccess(created);
      }

      setGenerating(false);
      closeModal(true);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Generation failed");
      setGenerating(false);
    }
  };

  if (!open) return null;

  const inputStyle = {
    width: "100%",
    padding: "12px 14px",
    borderRadius: "12px",
    border: "1px solid #CBD5E1",
    marginTop: "6px",
    marginBottom: "16px",
    outline: "none",
    fontSize: "14px",
    boxSizing: "border-box",
  };

  const labelStyle = {
    fontWeight: 700,
    color: "#0F172A",
    fontSize: "14px",
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(15,23,42,.48)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 999,
        padding: "20px",
      }}
    >
      <div
        style={{
          width: "760px",
          background: "#fff",
          borderRadius: "8px",
          padding: "28px",
          maxHeight: "90vh",
          overflowY: "auto",
          boxShadow: "0 24px 70px rgba(15,23,42,.25)",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "18px",
          }}
        >
          <div>
            <h2 style={{ margin: 0, color: "#0F172A" }}>
              Generate MCQ Set
            </h2>
            <p style={{ margin: "6px 0 0", color: "#64748B" }}>
              Use subject units, uploaded material, or a focused topic.
            </p>
          </div>

          <button
            onClick={closeModal}
            disabled={generating}
            style={iconButtonStyle}
            title="Close"
          >
            <FiX />
          </button>
        </div>

        {error && (
          <div
            style={{
              background: "#FEF2F2",
              border: "1px solid #FECACA",
              color: "#B91C1C",
              padding: "12px 14px",
              borderRadius: "8px",
              marginBottom: "16px",
            }}
          >
            {error}
          </div>
        )}

        <label style={labelStyle}>Title</label>
        <input
          style={inputStyle}
          placeholder="Example: Data Structures Practice MCQs"
          value={formData.title}
          onChange={(e) =>
            setFormData({ ...formData, title: e.target.value })
          }
        />

        <label style={labelStyle}>Subject</label>
        <select
          style={inputStyle}
          value={formData.subject}
          onChange={(e) =>
            setFormData({ ...formData, subject: e.target.value })
          }
        >
          <option value="">Select Subject</option>
          {subjects.map((subject) => (
            <option key={subject.id} value={subject.id}>
              {subject.code} - {subject.name}
            </option>
          ))}
        </select>

        <label style={labelStyle}>Topic or Focus</label>
        <input
          style={inputStyle}
          placeholder="Optional, but useful for RAG ranking"
          value={formData.topic}
          onChange={(e) =>
            setFormData({ ...formData, topic: e.target.value })
          }
        />

        <label style={labelStyle}>Units</label>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit,minmax(230px,1fr))",
            gap: "10px",
            marginTop: "8px",
            marginBottom: "18px",
          }}
        >
          {units.length > 0 ? (
            units.map((unit) => (
              <label
                key={unit.id}
                style={{
                  border: "1px solid #CBD5E1",
                  borderRadius: "8px",
                  padding: "10px",
                  display: "flex",
                  gap: "8px",
                  alignItems: "flex-start",
                  color: "#334155",
                }}
              >
                <input
                  type="checkbox"
                  checked={selectedUnits.includes(unit.unit_number)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedUnits((prev) => [
                        ...prev,
                        unit.unit_number,
                      ]);
                    } else {
                      setSelectedUnits((prev) =>
                        prev.filter((u) => u !== unit.unit_number)
                      );
                    }
                  }}
                />
                <span>
                  Unit {unit.unit_number} - {unit.title}
                </span>
              </label>
            ))
          ) : (
            <div
              style={{
                gridColumn: "1 / -1",
                color: "#64748B",
                background: "#F8FAFC",
                border: "1px dashed #CBD5E1",
                borderRadius: "8px",
                padding: "14px",
              }}
            >
              Select a subject to load units.
            </div>
          )}
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3,1fr)",
            gap: "14px",
          }}
        >
          <div>
            <label style={labelStyle}>Difficulty</label>
            <select
              style={inputStyle}
              value={formData.difficulty}
              onChange={(e) =>
                setFormData({ ...formData, difficulty: e.target.value })
              }
            >
              <option>Easy</option>
              <option>Medium</option>
              <option>Hard</option>
            </select>
          </div>

          <div>
            <label style={labelStyle}>Bloom Level</label>
            <select
              style={inputStyle}
              value={formData.bloomLevel}
              onChange={(e) =>
                setFormData({ ...formData, bloomLevel: e.target.value })
              }
            >
              <option>Remember</option>
              <option>Understand</option>
              <option>Apply</option>
              <option>Analyze</option>
              <option>Evaluate</option>
              <option>Create</option>
            </select>
          </div>

          <div>
            <label style={labelStyle}>Questions</label>
            <input
              type="number"
              min="1"
              max="50"
              style={inputStyle}
              value={formData.questionCount}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  questionCount: e.target.value,
                })
              }
            />
          </div>
        </div>

        <label style={labelStyle}>Upload Content</label>
        <label
          style={{
            marginTop: "8px",
            border: "1px dashed #94A3B8",
            borderRadius: "8px",
            padding: "18px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            cursor: "pointer",
            color: "#334155",
            background: "#F8FAFC",
          }}
        >
          <span style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            {formData.contentFile ? <FiFileText /> : <FiUploadCloud />}
            {formData.contentFile
              ? formData.contentFile.name
              : "PDF, PPTX, TXT, MD, CSV, or HTML"}
          </span>
          <input
            type="file"
            accept=".pdf,.pptx,.txt,.md,.csv,.html,text/*,application/pdf,application/vnd.openxmlformats-officedocument.presentationml.presentation"
            onChange={(e) =>
              setFormData({
                ...formData,
                contentFile: e.target.files?.[0] || null,
              })
            }
            style={{ display: "none" }}
          />
        </label>

        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            gap: "12px",
            marginTop: "24px",
          }}
        >
          <button
            onClick={closeModal}
            disabled={generating}
            style={secondaryButtonStyle}
          >
            Cancel
          </button>

          <button
            onClick={handleGenerate}
            disabled={generating}
            style={{
              ...primaryButtonStyle,
              opacity: generating ? 0.72 : 1,
              cursor: generating ? "not-allowed" : "pointer",
            }}
          >
            {generating ? "Generating..." : "Generate with AI"}
          </button>
        </div>
      </div>
    </div>
  );
}

const iconButtonStyle = {
  width: "40px",
  height: "40px",
  borderRadius: "8px",
  border: "1px solid #CBD5E1",
  background: "#fff",
  display: "grid",
  placeItems: "center",
  cursor: "pointer",
};

const secondaryButtonStyle = {
  padding: "12px 22px",
  borderRadius: "8px",
  border: "1px solid #CBD5E1",
  background: "#fff",
  cursor: "pointer",
  fontWeight: 700,
};

const primaryButtonStyle = {
  background: "#2563EB",
  color: "#fff",
  border: "none",
  padding: "12px 24px",
  borderRadius: "8px",
  cursor: "pointer",
  fontWeight: 700,
};
