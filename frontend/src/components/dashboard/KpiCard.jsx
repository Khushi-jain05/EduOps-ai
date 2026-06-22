export default function KpiCard({
  title,
  value,
  subtitle,
  icon,
  bg,
}) {
  return (
    <div
      className="dashboard-card"
      style={{ background: bg }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
        }}
      >
        <p>{title}</p>

        <div
          style={{
            width: "50px",
            height: "50px",
            borderRadius: "50%",
            background: "white",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow:
              "0 8px 20px rgba(0,0,0,.08)",
          }}
        >
          {icon}
        </div>
      </div>

      <h2>{value}</h2>

      <span>{subtitle}</span>
    </div>
  );
}