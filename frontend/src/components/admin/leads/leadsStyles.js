export const card = {
  background: "#fff",
  borderRadius: "20px",
  padding: "22px",
  boxShadow: "0 15px 40px rgba(37,99,235,.06)",
};

export const input = {
  width: "100%",
  padding: "12px 14px",
  borderRadius: "12px",
  border: "1px solid #DDE5F0",
  marginTop: "6px",
  marginBottom: "16px",
  fontSize: "14px",
  boxSizing: "border-box",
};

export const primaryButton = {
  background: "#2563eb",
  color: "#fff",
  border: "none",
  borderRadius: "12px",
  padding: "10px 20px",
  fontWeight: 600,
  cursor: "pointer",
};

export const secondaryButton = {
  background: "#fff",
  color: "#374151",
  border: "1px solid #DDE5F0",
  borderRadius: "12px",
  padding: "10px 20px",
  fontWeight: 600,
  cursor: "pointer",
};

export const modalOverlay = {
  position: "fixed",
  inset: 0,
  background: "rgba(15,23,42,.45)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 999,
};

export const modalCard = {
  width: "520px",
  maxWidth: "90vw",
  background: "#fff",
  borderRadius: "24px",
  padding: "30px",
  maxHeight: "88vh",
  overflowY: "auto",
};

export const statusColors = {
  new: { bg: "#f3f4f6", color: "#374151" },
  contacted: { bg: "#eff6ff", color: "#2563eb" },
  hot: { bg: "#fff7ed", color: "#ea580c" },
  enrolled: { bg: "#f0fdfa", color: "#0891b2" },
  lost: { bg: "#fef2f2", color: "#dc2626" },
};

export const badge = (status) => {
  const palette = statusColors[status] || statusColors.new;
  return {
    display: "inline-block",
    padding: "4px 12px",
    borderRadius: "20px",
    fontSize: "12px",
    fontWeight: 600,
    textTransform: "capitalize",
    background: palette.bg,
    color: palette.color,
  };
};
