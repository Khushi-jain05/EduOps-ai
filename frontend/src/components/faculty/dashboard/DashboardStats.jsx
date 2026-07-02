import {
  FiBookOpen,
  FiFileText,
  FiClipboard,
  FiEdit3,
} from "react-icons/fi";

import FacultyStatCard from "./FacultyStatCard";

export default function DashboardStats({ stats = {} }) {
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
        value={stats.subjectsAssigned || 0}
        subtitle="Current Semester"
        icon={<FiBookOpen />}
        iconColor="#2563EB"
        bgColor="#F8FAFF"
      />

      <FacultyStatCard
        title="Assignments Generated"
        value={stats.assignmentsGenerated || 0}
        subtitle="Created by you"
        icon={<FiClipboard />}
        iconColor="#06B6D4"
        bgColor="#F8FBFF"
      />

      <FacultyStatCard
        title="Lesson Plans"
        value={stats.lessonPlans || 0}
        subtitle="Prepared"
        icon={<FiEdit3 />}
        iconColor="#7C3AED"
        bgColor="#FBF8FF"
      />

      <FacultyStatCard
        title="Question Papers"
        value={stats.questionPapers || 0}
        subtitle="Generated"
        icon={<FiFileText />}
        iconColor="#F97316"
        bgColor="#FFF9F5"
      />
    </div>
  );
}
