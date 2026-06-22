import Sidebar from "../../components/layout/Sidebar";
import Navbar from "../../components/layout/Navbar";
import TimetableControls from "../../components/timetable/TimetableControls";
import TimetableHeader from "../../components/timetable/TimetableHeader";
// import TimetableToolbar from "../../components/timetable/TimetableToolbar";
import TimetableGrid from "../../components/timetable/TimetableGrid";
import TodaySchedule from "../../components/timetable/TodaySchedule";
import WeeklyStats from "../../components/timetable/WeeklyStats";

import "../../styles/timetable.css";

export default function Timetable() {
  return (
    <div className="timetable-layout">
      <Sidebar />

      <div className="timetable-content">
        <Navbar />

        <div className="timetable-wrapper">

          <TimetableHeader />
          <TimetableControls />
          {/* <TimetableToolbar /> */}

          <TimetableGrid />

          <div className="timetable-bottom">
            <TodaySchedule />
            <WeeklyStats />
          </div>

        </div>
      </div>
    </div>
  );
}