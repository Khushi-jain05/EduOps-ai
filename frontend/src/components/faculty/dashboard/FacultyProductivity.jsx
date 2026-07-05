import {
  FiTrendingUp,
  FiBookOpen,
  FiClipboard,
  FiFileText,
} from "react-icons/fi";

export default function FacultyProductivity({ productivity }) {
  const weekly = productivity?.weekly?.length
    ? productivity.weekly
    : ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((label) => ({
        label,
        count: 0,
      }));

  const summary = productivity?.summary || {
    questionPapers: 0,
    mcqSets: 0,
    lessonPlans: 0,
  };

  const maxCount = Math.max(1, ...weekly.map((d) => d.count));

  return (
    <div
      style={{
        background: "#fff",
        borderRadius: "24px",
        padding: "30px",
        marginTop: "30px",
        boxShadow: "0 10px 25px rgba(0,0,0,.04)",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "25px",
        }}
      >
        <div>
          <h2
            style={{
              margin: 0,
              color: "#111827",
            }}
          >
            Faculty Productivity
          </h2>

          <p
            style={{
              marginTop: "8px",
              color: "#64748B",
            }}
          >
            Weekly AI resource generation
          </p>
        </div>

        <FiTrendingUp
          size={26}
          color="#2563EB"
        />
      </div>

      {/* Graph */}

      <div
        style={{
          height: "230px",
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "space-between",
          marginBottom: "35px",
        }}
      >
        {weekly.map((day, index) => (
          <div
            key={index}
            style={{
              width: "12%",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <div
              title={`${day.count} created`}
              style={{
                width: "100%",
                height: `${Math.max(6, (day.count / maxCount) * 180)}px`,
                borderRadius: "14px",
                background:
                  "linear-gradient(180deg,#60A5FA,#2563EB)",
              }}
            />

            <span
              style={{
                marginTop: "12px",
                color: "#64748B",
                fontSize: "13px",
              }}
            >
              {day.label}
            </span>
          </div>
        ))}
      </div>

      {/* Summary */}

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3,1fr)",
          gap: "20px",
        }}
      >
        <SummaryCard
          icon={<FiFileText />}
          value={summary.questionPapers}
          label="Question Papers"
        />

        <SummaryCard
          icon={<FiClipboard />}
          value={summary.mcqSets}
          label="MCQs Generated"
        />

        <SummaryCard
          icon={<FiBookOpen />}
          value={summary.lessonPlans}
          label="Lesson Plans"
        />
      </div>
    </div>
  );
}

function SummaryCard({
  icon,
  value,
  label,
}) {
  return (
    <div
      style={{
        background: "#F8FAFC",
        borderRadius: "18px",
        padding: "20px",
      }}
    >
      <div
        style={{
          fontSize: "24px",
          color: "#2563EB",
        }}
      >
        {icon}
      </div>

      <h2
        style={{
          margin: "15px 0 6px",
          color: "#111827",
        }}
      >
        {value}
      </h2>

      <p
        style={{
          margin: 0,
          color: "#64748B",
        }}
      >
        {label}
      </p>
    </div>
  );
}