import { FiPlus } from "react-icons/fi";

export default function NewMcqCard({ onClick }) {
  return (
    <div
      onClick={onClick}
      style={{
        background:
          "linear-gradient(135deg,#EEF2FF,#F5F3FF)",
        border: "2px dashed #2563eb",
        borderRadius: "26px",
        minHeight: "340px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        cursor: "pointer",
        transition: ".25s",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform =
          "translateY(-6px)";
        e.currentTarget.style.boxShadow =
          "0 18px 45px rgba(124,58,237,.18)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform =
          "translateY(0)";
        e.currentTarget.style.boxShadow = "none";
      }}
    >
      <div
        style={{
          width: "74px",
          height: "74px",
          borderRadius: "50%",
          background:
            "linear-gradient(135deg,#2563eb,#60a5fa)",
          color: "#fff",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          fontSize: "34px",
          marginBottom: "22px",
          boxShadow:
            "0 12px 25px rgba(99,102,241,.35)",
        }}
      >
        <FiPlus />
      </div>

      <h2
        style={{
          margin: 0,
          color: "#2563eb",
          fontSize: "28px",
          fontWeight: 700,
        }}
      >
        New MCQ Set
      </h2>

      <p
        style={{
          marginTop: "12px",
          color: "#64748B",
          fontSize: "16px",
          textAlign: "center",
          maxWidth: "250px",
          lineHeight: "1.6",
        }}
      >
        Generate AI-powered MCQs from your
        question bank and study material.
      </p>

      <button
        style={{
          marginTop: "28px",
          background:
            "linear-gradient(135deg,#2563eb,#60a5fa)",
          color: "#fff",
          border: "none",
          borderRadius: "14px",
          padding: "12px 24px",
          fontSize: "15px",
          fontWeight: 600,
          cursor: "pointer",
        }}
      >
        Generate MCQs
      </button>
    </div>
  );
}