import { useNavigate } from "react-router-dom";
import {
  FiGrid,
  FiBook,
  FiCalendar,
  FiFileText,
  FiUser,
  FiLogOut,
} from "react-icons/fi";

import { PiRobotBold } from "react-icons/pi";
import { MdOutlineSupportAgent } from "react-icons/md";
export default function Sidebar() {
  const navigate = useNavigate();

  const user = JSON.parse(
    localStorage.getItem("user")
  );

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/");
  };

  return (
    <div
      style={{
        width: "280px",
        background: "#ffffff",
        borderRight: "1px solid #e5e7eb",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "20px",
      }}
    >
      {/* Logo */}
      <div>
        <div style={{ marginBottom: "40px" }}>
          <h2
            style={{
              color: "#2563eb",
              margin: 0,
            }}
          >
            EduOps AI
          </h2>

          <p
            style={{
              color: "#6b7280",
              fontSize: "12px",
              letterSpacing: "2px",
              marginTop: "5px",
            }}
          >
            EDUCATION OPERATIONS
          </p>
        </div>

        {/* Navigation */}
        <p
          style={{
            color: "#9ca3af",
            fontSize: "12px",
            letterSpacing: "2px",
            marginBottom: "15px",
          }}
        >
          LEARN
        </p>

        <div
  style={{
    background:
      "linear-gradient(90deg,#2563eb,#3b82f6)",
    color: "white",
    padding: "14px",
    borderRadius: "14px",
    marginBottom: "12px",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: "10px",
  }}
>
  <FiGrid />
  Dashboard
</div>

<div style={menuItem}>
  <MdOutlineSupportAgent />
  Support AI
</div>

<div style={menuItem}>
  <FiCalendar />
  Timetable
</div>

<div style={menuItem}>
  <FiFileText />
  Assignments
</div>

<div style={menuItem}>
  <FiBook />
  Exams
</div>

<div style={menuItem}>
  <PiRobotBold />
  Subject Assistant
</div>

        <p
          style={{
            color: "#9ca3af",
            fontSize: "12px",
            letterSpacing: "2px",
            marginTop: "40px",
            marginBottom: "15px",
          }}
        >
          ACCOUNT
        </p>

       <div style={menuItem}>
  <FiUser />
  Profile
</div>
      </div>

      {/* Bottom Section */}
      <div>
        <div
          style={{
            border: "1px solid #e5e7eb",
            borderRadius: "16px",
            padding: "15px",
            marginBottom: "15px",
            background: "#f8fafc",
          }}
        >
          <p
            style={{
              margin: 0,
              fontWeight: "600",
            }}
          >
            {user?.email}
          </p>

          <span
            style={{
              display: "inline-block",
              marginTop: "10px",
              background: "#2563eb",
              color: "white",
              padding: "4px 10px",
              borderRadius: "20px",
              fontSize: "12px",
              textTransform: "uppercase",
            }}
          >
            {user?.role}
          </span>
        </div>

        <button
  onClick={handleLogout}
  style={{
    width: "100%",
    padding: "14px",
    borderRadius: "14px",
    border: "1px solid #e5e7eb",
    background: "#fff",
    cursor: "pointer",
    fontWeight: "600",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
  }}
>
  <FiLogOut />
  Sign Out
</button>
      </div>
    </div>
  );
}

const menuItem = {
  display: "flex",
  alignItems: "center",
  gap: "10px",
  padding: "14px",
  borderRadius: "14px",
  cursor: "pointer",
  color: "#374151",
  marginBottom: "8px",
};