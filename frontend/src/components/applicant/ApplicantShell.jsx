import Sidebar from "../layout/Sidebar";
import Navbar from "../layout/Navbar";

export function ApplicantPage({ children }) {
  return (
    <div style={{ display: "flex", height: "100vh", background: "#EEF6FF" }}>
      <Sidebar />
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        <Navbar />
        <div style={{ flex: 1, overflowY: "auto", padding: "35px" }}>{children}</div>
      </div>
    </div>
  );
}

export function ApplicantHero({ tag, title, subtitle, children }) {
  return (
    <div
      style={{
        background: "linear-gradient(135deg,#3B60E4 0%,#5B7BF0 100%)",
        borderRadius: "30px",
        padding: "40px",
        color: "#fff",
        boxShadow: "0 20px 45px rgba(37,99,235,.25)",
      }}
    >
      <span
        style={{
          display: "inline-block",
          padding: "8px 18px",
          borderRadius: "999px",
          background: "rgba(255,255,255,.16)",
          fontSize: "14px",
          fontWeight: 600,
          marginBottom: "18px",
        }}
      >
        {tag}
      </span>
      <h1 style={{ margin: 0, fontSize: "52px", fontWeight: 700, lineHeight: 1.05 }}>{title}</h1>
      {subtitle && (
        <p style={{ marginTop: "16px", fontSize: "18px", maxWidth: "820px", color: "rgba(255,255,255,.92)" }}>
          {subtitle}
        </p>
      )}
      {children && <div style={{ marginTop: "26px" }}>{children}</div>}
    </div>
  );
}

export function StatRow({ items }) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(${items.length},1fr)`,
        gap: "22px",
        marginTop: "24px",
      }}
    >
      {items.map((s) => (
        <div
          key={s.label}
          style={{
            background: "#fff",
            borderRadius: "22px",
            padding: "26px",
            display: "flex",
            alignItems: "center",
            gap: "18px",
            boxShadow: "0 10px 30px rgba(15,23,42,.05)",
          }}
        >
          <div
            style={{
              width: "52px",
              height: "52px",
              borderRadius: "16px",
              background: "#EEF4FF",
              color: "#2563EB",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "22px",
            }}
          >
            {s.icon}
          </div>
          <div>
            <div style={{ fontSize: "28px", fontWeight: 700, color: "#111827", lineHeight: 1 }}>
              {s.value}
            </div>
            <div style={{ color: "#64748B", fontSize: "14px", marginTop: "4px" }}>{s.label}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

