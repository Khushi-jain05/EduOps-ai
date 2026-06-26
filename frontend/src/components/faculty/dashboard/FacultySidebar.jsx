import { NavLink } from "react-router-dom";
import {
  FiGrid,
  FiFileText,
  FiBook,
  FiClipboard,
  FiBarChart2,
  FiLogOut,
} from "react-icons/fi";

import "../../../styles/FacultySidebar.css";

const menu = [
  {
    title: "Dashboard",
    icon: <FiGrid />,
    path: "/faculty",
  },
  {
    title: "Question Paper",
    icon: <FiFileText />,
    path: "/faculty/question-paper",
  },
  {
    title: "MCQ Generator",
    icon: <FiClipboard />,
    path: "/faculty/mcq",
  },
  {
    title: "Lesson Plans",
    icon: <FiBook />,
    path: "/faculty/lesson-plan",
  },
  {
    title: "Analytics",
    icon: <FiBarChart2 />,
    path: "/faculty/analytics",
  },
];

export default function FacultySidebar() {
  return (
    <aside className="faculty-sidebar">

      <div className="faculty-logo">
        <h2>EduOps AI</h2>
        <p>Faculty Portal</p>
      </div>

      <div className="faculty-menu">
        {menu.map((item) => (
          <NavLink
            key={item.title}
            to={item.path}
            className={({ isActive }) =>
              isActive
                ? "faculty-link active"
                : "faculty-link"
            }
          >
            {item.icon}
            <span>{item.title}</span>
          </NavLink>
        ))}
      </div>

      <button className="logout-btn">
        <FiLogOut />
        Logout
      </button>

    </aside>
  );
}