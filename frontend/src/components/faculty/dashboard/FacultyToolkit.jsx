import {
  FiBookOpen,
  FiClipboard,
  FiEdit3,
  FiFileText,
  FiBarChart2,
} from "react-icons/fi";

import { useNavigate } from "react-router-dom";

import FacultyToolkitCard from "./FacultyToolkitCard";

export default function FacultyToolkit() {
  const navigate = useNavigate();

  const tools = [
    {
      title: "Question Paper",
      description:
        "Generate exam papers with Bloom's taxonomy.",
      icon: <FiFileText />,
      color: "#3B82F6",
      path: "/faculty/question-paper",
    },
    {
      title: "MCQ Generator",
      description:
        "Auto-create MCQs by topic & difficulty.",
      icon: <FiClipboard />,
      color: "#7C3AED",
      path: "/faculty/mcq",
    },
    {
      title: "Lesson Plans",
      description:
        "Session-wise plans aligned to outcomes.",
      icon: <FiEdit3 />,
      color: "#10B981",
      path: "/faculty/lesson-plan",
    },
    {
      title: "Assignments",
      description:
        "Create, distribute and track submissions.",
      icon: <FiBookOpen />,
      color: "#F97316",
      path: "/faculty/assignments",
    },
    {
      title: "Analytics",
      description:
        "Engagement, pacing and at-risk insights.",
      icon: <FiBarChart2 />,
      color: "#0EA5E9",
      path: "/faculty/analytics",
    },
  ];

  return (
    <section
      style={{
        background: "#fff",
        borderRadius: "28px",
        padding: "35px",
        boxShadow: "0 10px 25px rgba(0,0,0,.03)",
        marginBottom: "35px",
      }}
    >
      <h2
        style={{
          margin: 0,
          fontSize: "30px",
          color: "#111827",
        }}
      >
        Faculty Toolkit
      </h2>

      <p
        style={{
          color: "#64748B",
          marginTop: "8px",
          marginBottom: "28px",
          fontSize: "17px",
        }}
      >
        Jump straight into the AI tools available to you
      </p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(2,1fr)",
          gap: "20px",
        }}
      >
        {tools.map((tool) => (
          <FacultyToolkitCard
            key={tool.title}
            title={tool.title}
            description={tool.description}
            icon={tool.icon}
            iconBg={tool.color}
            onClick={() => navigate(tool.path)}
          />
        ))}
      </div>
    </section>
  );
}