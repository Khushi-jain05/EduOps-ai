import { FiPlus } from "react-icons/fi";

export default function NewLessonCard({ onClick }) {
  return (
    <div
      onClick={onClick}
      style={{
        borderRadius: "30px",
        minHeight: "355px",

        background:
          "linear-gradient(180deg,#F8FBFF 0%,#EEF5FF 100%)",

        border: "2px dashed #3B82F6",

        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",

        cursor: "pointer",

        transition: ".3s",

        boxShadow:
          "0 15px 40px rgba(37,99,235,.08)",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform =
          "translateY(-6px)";

        e.currentTarget.style.boxShadow =
          "0 25px 50px rgba(37,99,235,.18)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform =
          "translateY(0px)";

        e.currentTarget.style.boxShadow =
          "0 15px 40px rgba(37,99,235,.08)";
      }}
    >
      <div
        style={{
          width: "95px",
          height: "95px",

          borderRadius: "50%",

          background:
            "linear-gradient(135deg,#2563EB,#60A5FA)",

          display: "flex",
          justifyContent: "center",
          alignItems: "center",

          color: "#fff",

          fontSize: "44px",

          boxShadow:
            "0 15px 35px rgba(37,99,235,.35)",

          marginBottom: "30px",
        }}
      >
        <FiPlus />
      </div>

      <h2
        style={{
          margin: 0,
          color: "#1E3A8A",
          fontWeight: 700,
          fontSize: "30px",
        }}
      >
        New Lesson Plan
      </h2>

      <p
        style={{
          marginTop: "18px",
          width: "78%",
          textAlign: "center",

          color: "#64748B",

          fontSize: "17px",

          lineHeight: "30px",
        }}
      >
        Plan your weekly lectures,
        learning objectives, topics,
        resources and automatically
        sync them with the student
        timetable.
      </p>

      <button
        style={{
          marginTop: "32px",

          background:
            "linear-gradient(135deg,#2563EB,#4F8EF7)",

          color: "#fff",

          border: "none",

          borderRadius: "16px",

          padding: "14px 32px",

          fontSize: "16px",

          fontWeight: 600,

          cursor: "pointer",

          boxShadow:
            "0 10px 25px rgba(37,99,235,.25)",
        }}
      >
        Create Lesson Plan
      </button>
    </div>
  );
}
