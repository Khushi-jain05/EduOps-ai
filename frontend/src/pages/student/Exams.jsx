import Sidebar from "../../components/layout/Sidebar";
import Navbar from "../../components/layout/Navbar";

import {
  Calendar,
  Clock3,
  MapPin,
  Download,
} from "lucide-react";

import "../../styles/exams.css";

export default function Exams() {
  const exams = [
    {
      id: 1,
      code: "MA201",
      type: "MID SEM",
      subject: "Linear Algebra",
      date: "Mon · 24 Jun",
      time: "10:00 AM",
      venue: "Hall A · Block 2",
      duration: "2h",
      color: "blue",
    },
    {
      id: 2,
      code: "CS210",
      type: "END SEM",
      subject: "Data Structures",
      date: "Wed · 26 Jun",
      time: "02:00 PM",
      venue: "Lab 4 · Block 3",
      duration: "3h",
      color: "purple",
    },
    {
      id: 3,
      code: "PH101",
      type: "QUIZ",
      subject: "Physics Quiz 3",
      date: "Fri · 28 Jun",
      time: "09:00 AM",
      venue: "Room 207",
      duration: "45m",
      color: "yellow",
    },
  ];

  return (
    <div className="exam-layout">
      <Sidebar />
      <div className="exam-content">
        <Navbar />
        <div className="exam-wrapper">
          <div className="exam-header">
            <div className="exam-header-left">
              <span className="exam-label">🎓 Exam Center</span>
              <h1>Exams</h1>
              <p>Schedule, hall tickets, syllabus and your results — all in one view.</p>
            </div>
            <button className="download-btn">
              <Download size={18} />
              Download timetable PDF
            </button>
          </div>
          <div className="exam-stats">
            <div className="stat-card">
              <p>Next exam</p>
              <h3>Linear Algebra</h3>
              <span>Mon · 24 Jun · 10:00 AM</span>
              <div className="blue-text">⏰ in 2 days</div>
            </div>
            <div className="stat-card">
              <p>CGPA</p>
              <h2 className="cgpa-score">
                8.74
                <span>↗ +0.21</span>
              </h2>
              <div className="progress-bar">
                <div className="progress-fill" />
              </div>
            </div>
            <div className="stat-card">
              <p>This term</p>
              <h2>6 exams</h2>
              <span>🏅 4 cleared with A+</span>
            </div>
          </div>
          <div className="exam-tabs">
            <button className="active">Upcoming</button>
            <button>Past</button>
          </div>
          <div className="exam-grid">
            {exams.map((exam) => (
              <div key={exam.id} className={`exam-card ${exam.color}`}>
                <div className="duration">
                  <span>{exam.duration}</span>
                </div>
                <span className="exam-code">
                  {exam.code} · {exam.type}
                </span>
                <h3>{exam.subject}</h3>
                <div className="exam-row">
                  <div>
                    <Calendar size={16} />
                    {exam.date}
                  </div>
                  <div>
                    <Clock3 size={16} />
                    {exam.time}
                  </div>
                </div>
                <div className="exam-location">
                  <MapPin size={16} />
                  {exam.venue}
                </div>
                <div className="exam-footer">
                  <button className="details-btn">View details ↗</button>
                  <button className="ticket-btn">Hall ticket</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
