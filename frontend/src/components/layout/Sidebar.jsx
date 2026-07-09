import { useNavigate, useLocation } from "react-router-dom";

import {
  FiGrid,
  FiBook,
  FiCalendar,
  FiFileText,
  FiUser,
  FiUsers,
  FiPhoneCall,
  FiTarget,
  FiClock,
  FiAward,
  FiLogOut,
  FiBell,
  FiHelpCircle,
  FiFilePlus,
} from "react-icons/fi";

import { PiRobotBold } from "react-icons/pi";
import { MdOutlineSupportAgent } from "react-icons/md";

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const isFaculty = user.role === "faculty";
  const isApplicant = user.role === "applicant";
  const isAdmin = user.role === "admin";

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  // -------------------------
  // STUDENT MENU
  // -------------------------

  const studentMenu = [
    {
      icon: <FiGrid />,
      text: "Dashboard",
      path: "/student",
    },
    {
      icon: <MdOutlineSupportAgent />,
      text: "Support AI",
      path: "/support-ai",
    },
    {
      icon: <FiCalendar />,
      text: "Timetable",
      path: "/timetable",
    },
    {
      icon: <FiFileText />,
      text: "Assignments",
      path: "/assignments",
    },
    {
      icon: <FiBook />,
      text: "Exams",
      path: "/exams",
    },
    {
      icon: <PiRobotBold />,
      text: "Subject Assistant",
      path: "/subject-assistant",
    },
  ];

  // -------------------------
  // FACULTY MENU
  // -------------------------

  const facultyMenu = [
    {
      icon: <FiGrid />,
      text: "Dashboard",
      path: "/faculty",
    },
    {
      icon: <FiFileText />,
      text: "Question Paper",
      path: "/faculty/question-paper",
    },
    {
      icon: <PiRobotBold />,
      text: "MCQ Generator",
      path: "/faculty/mcq",
    },
    {
      icon: <FiCalendar />,
      text: "Lesson Plans",
      path: "/faculty/lesson-plan",
    },
    {
      icon: <FiFileText />,
      text: "Assignments",
      path: "/faculty/assignments",
    },
  ];

  // -------------------------
  // APPLICANT MENU
  // -------------------------

  const applicantMenu = [
    {
      icon: <FiGrid />,
      text: "Dashboard",
      path: "/applicant",
    },
    {
      icon: <PiRobotBold />,
      text: "Admissions AI",
      path: "/applicant/admissions-ai",
    },
    {
      icon: <FiHelpCircle />,
      text: "FAQs",
      path: "/applicant/faqs",
    },
    {
      icon: <FiBook />,
      text: "Courses & Fees",
      path: "/applicant/courses",
    },
    {
      icon: <FiFilePlus />,
      text: "Apply Now",
      path: "/applicant/apply",
    },
    {
      icon: <FiCalendar />,
      text: "Book Appointment",
      path: "/applicant/appointment",
    },
  ];

  // -------------------------
  // ADMIN MENU
  // -------------------------

  const adminMenuGroups = [
    {
      label: "LEAD OPS",
      items: [
        { icon: <FiGrid />, text: "Dashboard", path: "/admin" },
        { icon: <PiRobotBold />, text: "AI Admission Assist", path: "/admin/ai-admission-assist" },
        { icon: <FiTarget />, text: "Lead Intent Scoring", path: "/admin/lead-scoring" },
        { icon: <FiClock />, text: "Smart Follow-ups", path: "/admin/follow-ups" },
        { icon: <FiPhoneCall />, text: "AI Calling", path: "/admin/ai-calling" },
        { icon: <FiAward />, text: "Counselor Performance", path: "/admin/counselor-performance" },
        { icon: <FiUsers />, text: "All Leads", path: "/admin/leads" },
      ],
    },
  ];

  const accountMenu = [
    {
      icon: <FiUser />,
      text: "Profile",
      path: isFaculty
        ? "/faculty/profile"
        : isApplicant
          ? "/applicant/profile"
          : "/profile",
    },
  ];

  if (!isApplicant) {
    accountMenu.unshift({
      icon: <FiBell />,
      text: "Notifications",
      path: isFaculty ? "/faculty/notifications" : "/notifications",
    });
  }

  const menuItems = isFaculty
    ? facultyMenu
    : isApplicant
      ? applicantMenu
      : studentMenu;

  const menuGroups = isAdmin
    ? adminMenuGroups
    : [
        {
          label: isFaculty ? "TEACH" : isApplicant ? "ADMISSIONS" : "LEARN",
          items: menuItems,
        },
      ];

  return (
    <div
      style={{
        width: "280px",
        background: "#fff",
        borderRight: "1px solid #e5e7eb",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "20px",
        boxSizing: "border-box",
      }}
    >
      <div>
        {/* Logo */}

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

        {/* Sections */}

        {menuGroups.map((group) => (
          <div key={group.label}>
            <p
              style={{
                color: "#9ca3af",
                fontSize: "12px",
                letterSpacing: "2px",
                marginTop: "15px",
                marginBottom: "15px",
              }}
            >
              {group.label}
            </p>

            {group.items.map((item) => (
              <div
                key={item.path}
                onClick={() => navigate(item.path)}
                style={{
                  ...menuItem,
                  background:
                    location.pathname === item.path
                      ? "linear-gradient(135deg,#2563eb,#60a5fa)"
                      : "transparent",

                  color:
                    location.pathname === item.path
                      ? "#fff"
                      : "#374151",

                  boxShadow:
                    location.pathname === item.path
                      ? "0 8px 18px rgba(37,99,235,.25)"
                      : "none",
                }}
              >
                {item.icon}
                {item.text}
              </div>
            ))}
          </div>
        ))}

        {/* Account */}

        {accountMenu.length > 0 && (
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
        )}

        {accountMenu.map((item) => (
          <div
            key={item.path}
            onClick={() => navigate(item.path)}
            style={{
              ...menuItem,
              background:
                location.pathname === item.path
                  ? "linear-gradient(135deg,#2563eb,#60a5fa)"
                  : "transparent",

              color:
                location.pathname === item.path
                  ? "#fff"
                  : "#374151",

              boxShadow:
                location.pathname === item.path
                  ? "0 8px 18px rgba(37,99,235,.25)"
                  : "none",
            }}
          >
            {item.icon}
            {item.text}
          </div>
        ))}
      </div>

      {/* Bottom */}

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
            {user?.email || "Guest"}
          </p>

          <span
            style={{
              display: "inline-block",
              marginTop: "10px",
              background: "#2563eb",
              color: "#fff",
              padding: "4px 10px",
              borderRadius: "20px",
              fontSize: "12px",
              textTransform: "uppercase",
            }}
          >
            {user.role || "guest"}
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
  marginBottom: "8px",
  transition: "all .25s ease",
};
