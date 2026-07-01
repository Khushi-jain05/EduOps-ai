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
    display: "inline-block",
    padding: "8px 18px",
    borderRadius: "999px",
    background: "rgba(255,255,255,.15)",
    color: "#fff",
    fontSize: "16px",
    fontWeight: 300,
    marginBottom: "20px",
  }}
>
  Faculty • Lesson Plans
</div>

      {/* Heading */}

      <h1
  style={{
    margin: 0,
    color: "#fff",
    fontSize: "45px",
    fontWeight: 600,
    lineHeight: 1.1,
  }}
>
  Lesson Plans
</h1>

      <p
  style={{
    color: "rgba(255,255,255,.92)",
    fontSize: "18px",
    lineHeight: "34px",
    maxWidth: "900px",
    marginTop: "18px",
    marginBottom: "40px",
  }}
>
  Plan units, sessions and learning outcomes. AI helps organize your syllabus
  week by week and automatically syncs lessons with the student timetable.
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
            height: "55px",
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
            height: "55px",
            padding: "0 24px",
            borderRadius: "18px",
            border: "none",
            background: "#fff",
            color: "#2563EB",
            fontWeight: 700,
            fontSize: "13px",
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