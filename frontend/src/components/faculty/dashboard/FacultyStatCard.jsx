export default function FacultyStatCard({
  title,
  value,
  subtitle,
  icon,
  iconColor,
  bgColor,
}) {
  return (
    <div
      style={{
        background: bgColor,
        borderRadius: "26px",
        padding: "28px",
        minHeight: "170px",
        position: "relative",
        boxShadow: "0 10px 30px rgba(0,0,0,.04)",
      }}
    >
      <div
        style={{
          position: "absolute",
          right: "24px",
          top: "24px",
          width: "54px",
          height: "54px",
          borderRadius: "50%",
          background: "#fff",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          color: iconColor,
          fontSize: "24px",
          boxShadow: "0 8px 20px rgba(0,0,0,.08)",
        }}
      >
        {icon}
      </div>

      <p
        style={{
          color: "#64748B",
          fontSize: "14px",
          letterSpacing: "2px",
          textTransform: "uppercase",
          marginBottom: "18px",
          fontWeight: 600,
        }}
      >
        {title}
      </p>

      <h2
        style={{
          margin: 0,
          fontSize: "58px",
          fontWeight: "700",
          color: "#111827",
        }}
      >
        {value}
      </h2>

      <p
        style={{
          marginTop: "18px",
          color: "#64748B",
          fontSize: "18px",
        }}
      >
        {subtitle}
      </p>
    </div>
  );
}