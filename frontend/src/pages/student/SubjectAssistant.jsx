import Sidebar from "../../components/layout/Sidebar";
import Navbar from "../../components/layout/Navbar";

import SubjectCard from "../../components/subjectAssistant/SubjectCard";

import {
  Calculator,
  Code2,
  Atom,
  FlaskConical,
  Globe,
  Languages,

} from "lucide-react";

import "../../styles/subjectAssistant.css";

export default function SubjectAssistant() {
  const subjects = [
    {
      id: 1,
      code: "MA201",
      name: "Mathematics",
      faculty: "Dr. R. Mehta",
      topics: 18,
      progress: 72,
      color: "blue",
      icon: <Calculator size={24} />,
    },
    {
      id: 2,
      code: "CS210",
      name: "Computer Science",
      faculty: "Prof. S. Kapoor",
      topics: 22,
      progress: 58,
      color: "purple",
      icon: <Code2 size={24} />,
    },
    {
      id: 3,
      code: "PH101",
      name: "Physics",
      faculty: "Dr. N. Iyer",
      topics: 16,
      progress: 64,
      color: "orange",
      icon: <Atom size={24} />,
    },
    {
      id: 4,
      code: "CH102",
      name: "Chemistry",
      faculty: "Dr. P. Joshi",
      topics: 14,
      progress: 81,
      color: "green",
      icon: <FlaskConical size={24} />,
    },
    {
      id: 5,
      code: "HS105",
      name: "History",
      faculty: "Mrs. A. Roy",
      topics: 12,
      progress: 45,
      color: "pink",
      icon: <Globe size={24} />,
    },
    {
      id: 6,
      code: "EN105",
      name: "English",
      faculty: "Ms. T. Verma",
      topics: 10,
      progress: 90,
      color: "indigo",
      icon: <Languages size={24} />,
    },
  ];

  return (
    <div className="subject-layout">
      <Sidebar />

      <div className="subject-content">
        <Navbar />

        <div className="subject-wrapper">
          <div className="subject-header">
            <span className="subject-pill">
              Subject Assistants
            </span>

            <h1>
              Pick a subject to start learning
            </h1>

            <p>
              Each subject has its own AI tutor trained
              on your syllabus, notes and past papers.
            </p>
          </div>

          <div className="subject-grid">
            {subjects.map((subject) => (
              <SubjectCard
                key={subject.id}
                subject={subject}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}