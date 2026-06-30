import { useEffect, useState } from "react";

import { getSubjects } from "../../../services/subject.service";
import { getUnitsBySubject } from "../../../services/unit.service";
import { generateMcq } from "../../../services/mcq.service";

export default function GenerateMcqModal({
  open,
  onClose,
  onSuccess,
}) {
  const [subjects, setSubjects] = useState([]);
  const [units, setUnits] = useState([]);
  const [selectedUnits, setSelectedUnits] = useState([]);

  const [formData, setFormData] = useState({
    title: "",
    subject: "",
    difficulty: "",
    bloomLevel: "",
    questionCount: 10,
  });

  useEffect(() => {
    if (open) {
      loadSubjects();
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
      setSubjects(data);
    } catch (err) {
      console.error(err);
    }
  };

  const loadUnits = async (subjectId) => {
    try {
      const data = await getUnitsBySubject(subjectId);
      setUnits(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleGenerate = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));

      await generateMcq({
        title: formData.title,
        subjectId: formData.subject,
        facultyId: user.id,
        difficulty: formData.difficulty,
        bloomLevel: formData.bloomLevel,
        questionCount: Number(formData.questionCount),
        selectedUnits,
      });

      if (onSuccess) {
        await onSuccess();
      }

      alert("MCQ Set Generated Successfully");

      onClose();

    } catch (err) {
      console.error(err);

      alert(err.response?.data?.message || "Generation Failed");
    }
  };

  if (!open) return null;

  const inputStyle = {
    width: "100%",
    padding: "12px",
    borderRadius: "12px",
    border: "1px solid #ddd",
    marginTop: "6px",
    marginBottom: "18px",
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,.45)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 999,
      }}
    >
      <div
        style={{
          width: "700px",
          background: "#fff",
          borderRadius: "22px",
          padding: "30px",
          maxHeight: "90vh",
          overflowY: "auto",
        }}
      >
        <h2>Generate MCQ Set</h2>

        <label>Title</label>

        <input
          style={inputStyle}
          value={formData.title}
          onChange={(e) =>
            setFormData({
              ...formData,
              title: e.target.value,
            })
          }
        />

        <label>Subject</label>

        <select
          style={inputStyle}
          value={formData.subject}
          onChange={(e) =>
            setFormData({
              ...formData,
              subject: e.target.value,
            })
          }
        >
          <option value="">Select Subject</option>

          {subjects.map((subject) => (
            <option
              key={subject.id}
              value={subject.id}
            >
              {subject.code} - {subject.name}
            </option>
          ))}
        </select>

        <label>Select Units</label>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "10px",
            marginBottom: "20px",
          }}
        >
          {units.map((unit) => (
            <label
              key={unit.id}
              style={{
                border: "1px solid #ddd",
                borderRadius: "10px",
                padding: "10px",
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
                      prev.filter(
                        (u) => u !== unit.unit_number
                      )
                    );
                  }
                }}
              />

              {" "}
              Unit {unit.unit_number} - {unit.title}
            </label>
          ))}
        </div>

        <label>Difficulty</label>

        <select
          style={inputStyle}
          value={formData.difficulty}
          onChange={(e) =>
            setFormData({
              ...formData,
              difficulty: e.target.value,
            })
          }
        >
          <option value="">Select Difficulty</option>
          <option>Easy</option>
          <option>Medium</option>
          <option>Hard</option>
        </select>

        <label>Bloom Level</label>

        <select
          style={inputStyle}
          value={formData.bloomLevel}
          onChange={(e) =>
            setFormData({
              ...formData,
              bloomLevel: e.target.value,
            })
          }
        >
          <option value="">Select Bloom Level</option>
          <option>Remember</option>
          <option>Understand</option>
          <option>Apply</option>
          <option>Analyze</option>
          <option>Evaluate</option>
          <option>Create</option>
        </select>

        <label>Number of Questions</label>

        <input
          type="number"
          style={inputStyle}
          value={formData.questionCount}
          onChange={(e) =>
            setFormData({
              ...formData,
              questionCount: e.target.value,
            })
          }
        />

        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            gap: "15px",
            marginTop: "20px",
          }}
        >
          <button onClick={onClose}>
            Cancel
          </button>

          <button
            onClick={handleGenerate}
            style={{
              background: "#2563EB",
              color: "#fff",
              border: "none",
              padding: "12px 24px",
              borderRadius: "10px",
            }}
          >
            Generate with AI
          </button>
        </div>
      </div>
    </div>
  );
}