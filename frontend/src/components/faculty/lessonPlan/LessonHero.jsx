import { FiPlus, FiSearch } from "react-icons/fi";

export default function LessonHero({
  onNewClick,
}) {
  return (
    <div
      style={{
        background:
          "linear-gradient(135deg,#2563EB,#4F8EF7)",
        borderRadius: "34px",
        padding: "38px",
        color: "#fff",
        marginBottom: "28px",
        boxShadow:
          "0 18px 45px rgba(37,99,235,.25)",
      }}
    >
      {/* Badge */}

      <div
        style={{
          display: "inline-flex",
          alignItems: "center",
          background: "rgba(255,255,255,.18)",
          padding: "8px 18px",
          borderRadius: "40px",
          fontSize: "15px",
          marginBottom: "20px",
          backdropFilter: "blur(12px)",
        }}
      >
        Faculty • Lesson Plans
      </div>

      {/* Heading */}

      <h1
        style={{
          margin: 0,
          fontSize: "60px",
          fontWeight: 700,
          letterSpacing: "-1px",
        }}
      >
        Lesson Plans
      </h1>

      <p
        style={{
          marginTop: "16px",
          marginBottom: "34px",
          fontSize: "24px",
          opacity: 0.95,
          maxWidth: "980px",
          lineHeight: 1.6,
        }}
      >
        Plan units, sessions and learning outcomes.
        AI helps organize your syllabus week by week
        and automatically syncs lessons with the
        student timetable.
      </p>

      {/* Search + Button */}

      <div
        style={{
          display: "flex",
          gap: "18px",
          alignItems: "center",
        }}
      >
        {/* Search */}

        <div
          style={{
            flex: 1,
            background: "#fff",
            borderRadius: "18px",
            height: "66px",
            display: "flex",
            alignItems: "center",
            padding: "0 22px",
          }}
        >
          <FiSearch
            size={22}
            color="#94A3B8"
          />

          <input
            placeholder="Search Lesson Plans..."
            style={{
              border: "none",
              outline: "none",
              flex: 1,
              marginLeft: "15px",
              fontSize: "18px",
            }}
          />
        </div>

        {/* Button */}

        <button
          onClick={onNewClick}
          style={{
            height: "66px",
            padding: "0 34px",
            borderRadius: "18px",
            border: "none",
            background: "#fff",
            color: "#2563EB",
            fontWeight: 700,
            fontSize: "18px",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "10px",
            boxShadow:
              "0 8px 20px rgba(0,0,0,.08)",
          }}
        >
          <FiPlus />

          New Plan
        </button>
      </div>
    </div>
  );
}