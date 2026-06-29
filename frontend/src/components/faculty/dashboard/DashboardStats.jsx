import {
  FiBookOpen,
  FiFileText,
  FiClipboard,
  FiEdit3,
} from "react-icons/fi";

import FacultyStatCard from "./FacultyStatCard";

export default function DashboardStats() {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(4,1fr)",
        gap: "24px",
        marginBottom: "35px",
      }}
    >
      <FacultyStatCard
        title="Subjects Assigned"
        value="4"
        subtitle="Current Semester"
        icon={<FiBookOpen />}
        iconColor="#2563EB"
        bgColor="#F8FAFF"
      />

      <FacultyStatCard
        title="Assignments Generated"
        value="18"
        subtitle="+12% this month"
        icon={<FiClipboard />}
        iconColor="#06B6D4"
        bgColor="#F8FBFF"
      />

      <FacultyStatCard
        title="Lesson Plans"
        value="9"
        subtitle="Prepared"
        icon={<FiEdit3 />}
        iconColor="#7C3AED"
        bgColor="#FBF8FF"
      />

      <FacultyStatCard
        title="Question Papers"
        value="6"
        subtitle="+8%"
        icon={<FiFileText />}
        iconColor="#F97316"
        bgColor="#FFF9F5"
      />
    </div>
  );
}