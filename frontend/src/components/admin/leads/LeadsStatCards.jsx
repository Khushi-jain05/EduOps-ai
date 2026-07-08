import { FiUsers, FiTrendingUp, FiCheckCircle, FiTarget } from "react-icons/fi";
import { card } from "./leadsStyles";

export default function LeadsStatCards({ stats }) {
  const cards = [
    {
      label: "Total leads (30d)",
      value: stats.totalLeads30d,
      icon: <FiUsers />,
      bg: "#eef4ff",
      color: "#2563eb",
    },
    {
      label: "Hot leads (score ≥ 80)",
      value: stats.hotLeads,
      icon: <FiTrendingUp />,
      bg: "#fff1e9",
      color: "#ea580c",
    },
    {
      label: "Enrolled this month",
      value: stats.enrolledThisMonth,
      icon: <FiCheckCircle />,
      bg: "#e8fbf6",
      color: "#0891b2",
    },
    {
      label: "Conversion rate",
      value: `${stats.conversionRate}%`,
      icon: <FiTarget />,
      bg: "#f5f0ff",
      color: "#7c3aed",
    },
  ];

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(4, 1fr)",
        gap: "20px",
        marginBottom: "25px",
      }}
    >
      {cards.map((c) => (
        <div key={c.label} style={card}>
          <div
            style={{
              width: "44px",
              height: "44px",
              borderRadius: "12px",
              background: c.bg,
              color: c.color,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "20px",
              marginBottom: "14px",
            }}
          >
            {c.icon}
          </div>
          <h2 style={{ margin: 0, fontSize: "28px" }}>{c.value}</h2>
          <p style={{ color: "#64748B", marginTop: "4px" }}>{c.label}</p>
        </div>
      ))}
    </div>
  );
}
