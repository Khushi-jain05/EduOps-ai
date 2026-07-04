import { FiSearch } from "react-icons/fi";
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
        justifyContent: "space-between",
        padding: "0 30px",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "10px",
          background: "#f3f4f6",
          padding: "12px 16px",
          borderRadius: "12px",
          width: "400px",
        }}
      >
        <FiSearch />
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

      <NotificationDropdown />
    </div>
  );
}
