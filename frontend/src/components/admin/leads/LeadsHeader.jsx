import { FiSearch, FiPlus } from "react-icons/fi";
import { primaryButton } from "./leadsStyles";

export default function LeadsHeader({ search, onSearchChange, onAddLead }) {
  return (
    <div
      style={{
        background: "linear-gradient(135deg,#2563eb,#4f8ef7)",
        borderRadius: "26px",
        padding: "40px",
        color: "#fff",
        marginBottom: "25px",
      }}
    >
      <span
        style={{
          background: "rgba(255,255,255,.18)",
          padding: "6px 14px",
          borderRadius: "20px",
          fontSize: "13px",
        }}
      >
        Admin • Lead Management
      </span>

      <h1 style={{ margin: "18px 0 10px", fontSize: "36px" }}>
        Lead Handling Command Center
      </h1>

      <p style={{ opacity: 0.9, maxWidth: "700px", marginBottom: "26px" }}>
        Capture, score and convert admissions leads with WhatsApp automation,
        AI calling agents, and live Google Sheets sync — all in one place.
      </p>

      <div style={{ display: "flex", gap: "16px" }}>
        <div
          style={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            gap: "10px",
            background: "#fff",
            borderRadius: "16px",
            padding: "14px 18px",
          }}
        >
          <FiSearch color="#94a3b8" />
          <input
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search leads by name, phone, email, course, city..."
            style={{
              border: "none",
              outline: "none",
              width: "100%",
              fontSize: "14px",
            }}
          />
        </div>

        <button
          onClick={onAddLead}
          style={{
            ...primaryButton,
            background: "#fff",
            color: "#2563eb",
            display: "flex",
            alignItems: "center",
            gap: "8px",
            whiteSpace: "nowrap",
          }}
        >
          <FiPlus /> Add Lead
        </button>
      </div>
    </div>
  );
}
