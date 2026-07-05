import { useEffect, useState } from "react";
import Sidebar from "../../components/layout/Sidebar";
import Navbar from "../../components/layout/Navbar";
import RecentActivity from "../../components/faculty/dashboard/RecentActivity";
import UpcomingClasses from "../../components/faculty/dashboard/UpcomingClasses";
import WelcomeBanner from "../../components/faculty/dashboard/WelcomeBanner";
import DashboardStats from "../../components/faculty/dashboard/DashboardStats";
import FacultyToolkit from "../../components/faculty/dashboard/FacultyToolkit";
import FacultyProductivity from "../../components/faculty/dashboard/FacultyProductivity";
import { getFacultyDashboard } from "../../services/faculty.service";

export default function FacultyDashboard() {
  const [dashboard, setDashboard] = useState({
    stats: {},
    upcomingClasses: [],
    recentActivity: [],
    productivity: null,
  });

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const data = await getFacultyDashboard();
        setDashboard(data);
      } catch (err) {
        console.error(err);
      }
    };

    loadDashboard();
  }, []);

  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
        background: "#EEF6FF",
        overflow: "hidden",
      }}
    >
      {/* Sidebar */}
      <Sidebar />

      {/* Right Side */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          background: "#EEF6FF",
        }}
      >
        {/* Navbar */}
        <Navbar />

        {/* Scrollable Content */}
        <div
          style={{
            flex: 1,
            overflowY: "auto",
            padding: "35px",
          }}
        >
          <WelcomeBanner />

          <DashboardStats stats={dashboard.stats} />

          <FacultyToolkit />
          <div
  style={{
    display: "grid",
    gridTemplateColumns: "2fr 1fr",
    gap: "25px",
    marginTop: "35px",
    alignItems: "start",
  }}
>
  <RecentActivity activities={dashboard.recentActivity} />
   <UpcomingClasses classes={dashboard.upcomingClasses} />
</div>
<FacultyProductivity productivity={dashboard.productivity} />
        </div>
      </div>
    </div>
  );
}
