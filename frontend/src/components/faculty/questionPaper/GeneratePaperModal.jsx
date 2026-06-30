import { useState, useEffect } from "react";
import { createQuestionPaper } from "../../../services/questionPaper.service";
import { getSubjects } from "../../../services/subject.service";
import { getUnitsBySubject } from "../../../services/unit.service";

export default function GeneratePaperModal({
  open,
  onClose,
  onSuccess,
}) {
  const [subjects, setSubjects] = useState([]);
  const [units, setUnits] = useState([]);
  const [selectedUnits, setSelectedUnits] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    subject: "",
    examType: "",
    semester: "",
    academicYear: "",
    duration: "",
    totalMarks: "",
    difficulty: "",
    bloomLevel: "",
    instructions: "",
  });

  const resetForm = () => {
    setFormData({
      title: "",
      subject: "",
      examType: "",
      semester: "",
      academicYear: "",
      duration: "",
      totalMarks: "",
      difficulty: "",
      bloomLevel: "",
      instructions: "",
    });
    setSelectedUnits([]);
    setUnits([]);
  };

  useEffect(() => {
    if (open) {
      loadSubjects();
    }
  }, [open]);

  const loadSubjects = async () => {
    try {
      const data = await getSubjects();
      setSubjects(data);
    } catch (err) {
      console.error("Failed to load subjects", err);
    }
  };

  useEffect(() => {
    if (formData.subject) {
      loadUnits(formData.subject);
    } else {
      setUnits([]);
      setSelectedUnits([]);
    }
  }, [formData.subject]);

  const loadUnits = async (subjectId) => {
    try {
      const data = await getUnitsBySubject(subjectId);
      setUnits(data);
    } catch (err) {
      console.error("Failed to load units", err);
      setUnits([]);
      setSelectedUnits([]);
    }
  };

  const handleGenerate = async () => {
    if (!formData.title) {
      return alert("Please enter paper title");
    }

    if (!formData.subject) {
      return alert("Please select a subject");
    }

    if (selectedUnits.length === 0) {
      return alert("Please select at least one unit");
    }

    if (!formData.examType) {
      return alert("Please select exam type");
    }

    try {
      if (!localStorage.getItem("token")) {
        return alert("Please login again before generating a paper");
      }

      setIsGenerating(true);

      await createQuestionPaper({
        title: formData.title,
        subjectId: formData.subject,
        examType: formData.examType,
        semester: formData.semester,
        academicYear: formData.academicYear,
        duration: formData.duration,
        totalMarks: formData.totalMarks,
        difficulty: formData.difficulty,
        bloomLevel: formData.bloomLevel,
        instructions: formData.instructions,
        selectedUnits,
      });

      if (onSuccess) {
        await onSuccess();
      }

      resetForm();

      alert("Question Paper Created Successfully");

      onClose();
    } catch (err) {
      console.error(err);
      alert(
        err.response?.data?.message ||
          "Something went wrong while generating the paper"
      );
    } finally {
      setIsGenerating(false);
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
    fontSize: "15px",
    outline: "none",
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
        <h2>Generate Question Paper</h2>

        <label>Paper Title</label>
        <input
          style={inputStyle}
          placeholder="DBMS Mid Semester Paper"
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
          {units.length === 0 ? (
            <p
              style={{
                color: "#64748B",
                fontSize: "14px",
              }}
            >
              Select a subject to load units.
            </p>
          ) : (
            units.map((unit) => (
              <label
                key={unit.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  padding: "10px",
                  border: "1px solid #E2E8F0",
                  borderRadius: "10px",
                  cursor: "pointer",
                }}
              >
                <input
                  type="checkbox"
                  checked={selectedUnits.includes(unit.unitNumber)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedUnits((prev) => [
                        ...prev,
                        unit.unitNumber,
                      ]);
                    } else {
                      setSelectedUnits((prev) =>
                        prev.filter(
                          (unitNumber) =>
                            unitNumber !== unit.unitNumber
                        )
                      );
                    }
                  }}
                />

                Unit {unit.unitNumber} - {unit.title}
              </label>
            ))
          )}
        </div>

        <label>Exam Type</label>

        <select
          style={inputStyle}
          value={formData.examType}
          onChange={(e) =>
            setFormData({
              ...formData,
              examType: e.target.value,
            })
          }
        >
          <option value="">Select Exam Type</option>
          <option value="Mid Semester">Mid Semester</option>
          <option value="End Semester">End Semester</option>
          <option value="Quiz">Quiz</option>
          <option value="Practice">Practice</option>
        </select>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "15px",
          }}
        >
          <div>
            <label>Semester</label>

            <input
              style={inputStyle}
              type="number"
              min="1"
              value={formData.semester}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  semester: e.target.value,
                })
              }
            />
          </div>

          <div>
            <label>Academic Year</label>

            <input
              style={inputStyle}
              placeholder="2026-27"
              value={formData.academicYear}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  academicYear: e.target.value,
                })
              }
            />
          </div>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "15px",
          }}
        >
          <div>
            <label>Duration</label>

            <input
              style={inputStyle}
              placeholder="90 min"
              value={formData.duration}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  duration: e.target.value,
                })
              }
            />
          </div>

          <div>
            <label>Total Marks</label>

            <input
              style={inputStyle}
              type="number"
              min="0"
              value={formData.totalMarks}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  totalMarks: e.target.value,
                })
              }
            />
          </div>
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
          <option value="Easy">Easy</option>
          <option value="Medium">Medium</option>
          <option value="Hard">Hard</option>
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
          <option value="Remember">Remember</option>
          <option value="Understand">Understand</option>
          <option value="Apply">Apply</option>
          <option value="Analyze">Analyze</option>
          <option value="Evaluate">Evaluate</option>
          <option value="Create">Create</option>
        </select>

        <label>Instructions</label>

        <textarea
          rows="5"
          style={inputStyle}
          value={formData.instructions}
          onChange={(e) =>
            setFormData({
              ...formData,
              instructions: e.target.value,
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
          <button
            onClick={onClose}
            style={{
              padding: "12px 22px",
              borderRadius: "12px",
              border: "none",
              cursor: "pointer",
            }}
          >
            Cancel
          </button>

          <button
            onClick={handleGenerate}
            disabled={isGenerating}
            style={{
              padding: "12px 25px",
              borderRadius: "12px",
              border: "none",
              background: isGenerating ? "#94A3B8" : "#2563EB",
              color: "#fff",
              cursor: isGenerating ? "not-allowed" : "pointer",
            }}
          >
            {isGenerating ? "Generating..." : "Generate with AI"}
          </button>
        </div>
      </div>
    </div>
  );
}
