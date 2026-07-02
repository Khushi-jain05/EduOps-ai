import { useEffect, useState } from "react";
import Sidebar from "../../components/layout/Sidebar";
import Navbar from "../../components/layout/Navbar";
import { useNavigate } from "react-router-dom";
import "../../styles/student-dashboard.css";

import { getDashboard } from "../../services/student.service";

import {
  CalendarDays,
  GraduationCap,
  ClipboardList,
  BadgeCheck,
} from "lucide-react";

export default function StudentDashboard() {
  const [dashboardData, setDashboardData] = useState({
  attendance: 0,
  upcomingClasses: 0,
  pendingAssignments: 0,
  timetable: [],
  assignments: [],
  notifications: [],
});
const navigate = useNavigate();
  const user = JSON.parse(
    localStorage.getItem("user")
  );

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const data = await getDashboard();

        console.log("Dashboard Data:", data);

        setDashboardData(data);
      } catch (error) {
        console.log(error);
      }
    };

    loadDashboard();
  }, []);



  return (
    <div className="dashboard-layout">
      <Sidebar />

      <div className="dashboard-content">
        <Navbar />

        <div className="dashboard-wrapper">
          {/* HEADER */}

          <div className="welcome-section">
            <p className="workspace-label">
              STUDENT WORKSPACE
            </p>

            <h1 className="welcome-title">
              Hello,{" "}
              <span>
                {user?.username || "Student"}
              </span>
            </h1>

            <p className="welcome-subtitle">
              Learn smarter with your AI study companion.
            </p>
          </div>

          {/* KPI */}

          <div className="kpi-grid">
            <div
              className="dashboard-card"
              style={{ background: "#f8fbff" }}
            >
              <div className="kpi-header">
                <p>UPCOMING CLASSES</p>

                <div className="icon-circle">
                  <CalendarDays
                    size={24}
                    color="#2563eb"
                  />
                </div>
              </div>

              <h2>
                {dashboardData.upcomingClasses}
              </h2>

              <span>Today</span>
            </div>

            <div
              className="dashboard-card"
              style={{ background: "#faf5ff" }}
            >
              <div className="kpi-header">
                <p>UPCOMING EXAMS</p>

                <div className="icon-circle">
                  <GraduationCap
                    size={24}
                    color="#7c3aed"
                  />
                </div>
              </div>

              <h2>2</h2>

              <span>Next 7 days</span>
            </div>

            <div
              className="dashboard-card"
              style={{ background: "#fff7ed" }}
            >
              <div className="kpi-header">
                <p>PENDING ASSIGNMENTS</p>

                <div className="icon-circle">
                  <ClipboardList
                    size={24}
                    color="#ea580c"
                  />
                </div>
              </div>

              <h2>
                {dashboardData.pendingAssignments}
              </h2>

              <span>Due this week</span>
            </div>

            <div
              className="dashboard-card"
              style={{ background: "#f0fdfa" }}
            >
              <div className="kpi-header">
                <p>ATTENDANCE</p>

                <div className="icon-circle">
                  <BadgeCheck
                    size={24}
                    color="#0891b2"
                  />
                </div>
              </div>

              <h2>
                {dashboardData.attendance}%
              </h2>

              <span>
                Current Attendance
              </span>
            </div>
          </div>

          {/* TIMETABLE + ASSIGNMENTS */}

          <div className="content-grid">
            {/* TIMETABLE */}

            <div className="white-card">
              <div className="card-header">
                <div>
                  <h2>Today's Timetable</h2>

                  <p>
                    Your scheduled classes
                  </p>
                </div>

                <button className="small-btn">
                  View Full Week
                </button>
              </div>

              {dashboardData.timetable.length ===
              0 ? (
                <p>
                  No classes scheduled.
                </p>
              ) : (
                dashboardData.timetable.map(
                  (item) => (
                    <div
                      key={item.id}
                      className="schedule-item"
                    >
                      <div className="time-badge">
                        {item.startTime}
                      </div>

                      <div>
                        <strong>
                          {item.subject}
                        </strong>

                        <p>
                          {item.faculty}
                          {" • "}
                          Room {item.room}
                        </p>
                      </div>
                    </div>
                  )
                )
              )}
            </div>

            {/* ASSIGNMENTS */}

            <div className="white-card">
              <div className="card-header">
                <div>
                  <h2>
                    Assignment Deadlines
                  </h2>

                  <p>
                    Submit before due date
                  </p>
                </div>

                <button className="small-btn">
                  All
                </button>
              </div>

              {dashboardData.assignments
                .length === 0 ? (
                <p>
                  No assignments found.
                </p>
              ) : (
                dashboardData.assignments.map(
                  (item) => (
                    <div
                      key={item.id}
                      className="assignment-item"
                    >
                      <div>
                        <strong>
                          {item.title}
                        </strong>

                        <p>
                          {item.subject}
                        </p>
                      </div>

                      <span className="assignment-badge">
                        {item.status}
                      </span>
                    </div>
                  )
                )
              )}
            </div>
          </div>

          <div className="white-card">
            <div className="card-header">
              <div>
                <h2>Notifications</h2>

                <p>Latest lesson plan updates</p>
              </div>
            </div>

            {dashboardData.notifications.length === 0 ? (
              <p>No new notifications.</p>
            ) : (
              dashboardData.notifications.map((item) => (
                <div
                  key={item.id}
                  className="schedule-item"
                >
                  <div className="time-badge">
                    New
                  </div>

                  <div>
                    <strong>{item.title}</strong>

                    <p>{item.message}</p>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* AI ASSISTANT */}

          <div className="white-card">
  <div
    style={{
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
    }}
  >
    <div>
      <h2>AI Study Assistant</h2>

      <p>
        Get instant help with subjects,
        assignments, notes and exams.
      </p>
    </div>

    <button
      className="chat-btn"
      onClick={() =>
        navigate("/support-ai")
      }
    >
      Launch AI Assistant →
    </button>
  </div>
</div>
        </div>
      </div>
    </div>
  );
}
