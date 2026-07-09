import { FiSearch } from "react-icons/fi";
import { PanelLeft } from "lucide-react";
import NotificationDropdown from "../notifications/NotificationDropdown";

export default function Navbar() {
  return (
    <div
      style={{
        height: "80px",
        background: "#fff",
        borderBottom: "1px solid #e5e7eb",
        display: "flex",
        alignItems: "center",
        gap: "16px",
        padding: "0 30px",
      }}
    >
      <button
        type="button"
        title="Toggle sidebar"
        style={{
          width: "38px",
          height: "38px",
          flexShrink: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          border: "1px solid #e5e7eb",
          borderRadius: "10px",
          background: "#fff",
          color: "#64748b",
          cursor: "pointer",
        }}
      >
        <PanelLeft size={18} />
      </button>

      <div
        style={{
          flex: 1,
          maxWidth: "560px",
          display: "flex",
          alignItems: "center",
          gap: "10px",
          background: "#f3f4f6",
          padding: "12px 18px",
          borderRadius: "999px",
        }}
      >
        <FiSearch color="#94a3b8" />
        <input
          type="text"
          placeholder="Search across EduOps AI..."
          style={{
            border: "none",
            background: "transparent",
            width: "100%",
            outline: "none",
          }}
        />
      </div>

      <div style={{ marginLeft: "auto" }}>
        <NotificationDropdown />
      </div>
    </div>
  );
}
