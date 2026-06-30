import { useState } from "react";
import { createQuestionPaper } from "../../../services/questionPaper.service";
export default function GeneratePaperModal({
  open,
  onClose,
}) {
    const handleGenerate = async () => {
  try {
    const user = JSON.parse(localStorage.getItem("user"));

    await createQuestionPaper({
      title: formData.title,
      subjectId: formData.subject,
      facultyId: user.id,
      examType: formData.examType,
      semester: Number(formData.semester),
      academicYear: formData.academicYear,
      duration: formData.duration,
      totalMarks: Number(formData.totalMarks),
      difficulty: formData.difficulty,
      bloomLevel: formData.bloomLevel,
      instructions: formData.instructions,
    });

    alert("Question Paper Created Successfully");

    onClose();
  } catch (err) {
    console.error(err);
    alert("Something went wrong");
  }
};
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
          <option>Select Subject</option>
          <option>DBMS</option>
          <option>Operating Systems</option>
          <option>Computer Networks</option>
          <option>Data Structures</option>
        </select>

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
          <option>Mid Semester</option>
          <option>End Semester</option>
          <option>Quiz</option>
          <option>Practice</option>
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
          <option>Remember</option>
          <option>Understand</option>
          <option>Apply</option>
          <option>Analyze</option>
          <option>Evaluate</option>
          <option>Create</option>
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
            style={{
              padding: "12px 25px",
              borderRadius: "12px",
              border: "none",
              background: "#2563EB",
              color: "#fff",
              cursor: "pointer",
            }} onClick={handleGenerate}
          >
            Generate with AI
          </button>
        </div>
      </div>
    </div>
  );
}