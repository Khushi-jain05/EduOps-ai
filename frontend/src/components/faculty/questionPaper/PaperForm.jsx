import { useState } from "react";

import SubjectSelector from "./SubjectSelector";
import UnitSelector from "./UnitSelector";
import DifficultySelector from "./DifficultySelector";
import BloomSelector from "./BloomSelector";
import MarksInput from "./MarksInput";
import GenerateButton from "./GenerateButton";

export default function PaperForm() {
  const [formData, setFormData] = useState({
    subject: "",
    examType: "",
    semester: "",
    academicYear: "",
    duration: "",
    totalMarks: "",
    difficulty: "",
    bloomLevel: "",
    units: [],
    instructions: "",
  });

  const updateField = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <div
      style={{
        background: "#fff",
        padding: "30px",
        borderRadius: "20px",
        marginBottom: "30px",
        boxShadow: "0 8px 20px rgba(0,0,0,.05)",
      }}
    >
      <h2 style={{ marginBottom: 30 }}>
        Question Paper Generator
      </h2>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(2,1fr)",
          gap: "20px",
        }}
      >
        <SubjectSelector
          value={formData.subject}
          onChange={(v) => updateField("subject", v)}
        />

        <select
          value={formData.examType}
          onChange={(e) =>
            updateField("examType", e.target.value)
          }
        >
          <option value="">Exam Type</option>
          <option>Mid Semester</option>
          <option>End Semester</option>
          <option>Internal</option>
        </select>

        <input
          placeholder="Semester"
          value={formData.semester}
          onChange={(e) =>
            updateField("semester", e.target.value)
          }
        />

        <input
          placeholder="Academic Year"
          value={formData.academicYear}
          onChange={(e) =>
            updateField("academicYear", e.target.value)
          }
        />

        <MarksInput
          value={formData.totalMarks}
          onChange={(v) =>
            updateField("totalMarks", v)
          }
        />

        <input
          placeholder="Duration"
          value={formData.duration}
          onChange={(e) =>
            updateField("duration", e.target.value)
          }
        />

        <DifficultySelector
          value={formData.difficulty}
          onChange={(v) =>
            updateField("difficulty", v)
          }
        />

        <BloomSelector
          value={formData.bloomLevel}
          onChange={(v) =>
            updateField("bloomLevel", v)
          }
        />
      </div>

      <div style={{ marginTop: 25 }}>
        <UnitSelector
          selected={formData.units}
          onChange={(v) =>
            updateField("units", v)
          }
        />
      </div>

      <textarea
        rows="5"
        placeholder="General Instructions..."
        value={formData.instructions}
        onChange={(e) =>
          updateField("instructions", e.target.value)
        }
        style={{
          width: "100%",
          marginTop: "25px",
          padding: "15px",
          borderRadius: "12px",
          border: "1px solid #ddd",
          resize: "none",
        }}
      />

      <div style={{ marginTop: 25 }}>
        <GenerateButton formData={formData} />
      </div>
    </div>
  );
}