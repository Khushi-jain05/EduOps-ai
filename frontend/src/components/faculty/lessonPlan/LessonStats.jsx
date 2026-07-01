import {
  FiBookOpen,
  FiCheckCircle,
  FiClock,
} from "react-icons/fi";

export default function LessonStats({
  plans,
}) {
  const total = plans.length;

  const active = plans.filter(
    (p) => p.status === "active"
  ).length;

  const drafts = plans.filter(
    (p) =>
      p.status === "draft" ||
      p.status === "scheduled"
  ).length;

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns:
          "repeat(3,1fr)",
        gap: "22px",
        marginBottom: "28px",
      }}
    >
      <StatCard
        icon={<FiBookOpen />}
        value={total}
        label="Total Plans"
      />

      <StatCard
        icon={<FiCheckCircle />}
        value={active}
        label="Active"
      />

      <StatCard
        icon={<FiClock />}
        value={drafts}
        label="Drafts"
      />
    </div>
  );
}

function StatCard({
  icon,
  value,
  label,
}) {
  return (
    <div
      style={{
        background: "#fff",
        borderRadius: "26px",
        padding: "28px",
        display: "flex",
        alignItems: "center",
        gap: "22px",

        boxShadow:
          "0 10px 30px rgba(15,23,42,.06)",

        border: "1px solid #EDF2F7",
      }}
    >
      <div
        style={{
          width: "72px",
          height: "72px",

          borderRadius: "22px",

          background:
            "linear-gradient(135deg,#EEF4FF,#DCEBFF)",

          display: "flex",
          justifyContent: "center",
          alignItems: "center",

          fontSize: "32px",

          color: "#2563EB",
        }}
      >
        {icon}
      </div>

      <div>
        <div
          style={{
            fontSize: "44px",
            fontWeight: 700,
            color: "#172554",
            lineHeight: 1,
          }}
        >
          {value}
        </div>

        <div
          style={{
            marginTop: "10px",
            color: "#64748B",
            fontSize: "22px",
          }}
        >
          {label}
        </div>
      </div>
    </div>
  );
}