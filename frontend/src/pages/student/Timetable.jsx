import { useEffect, useState } from "react";

import Sidebar from "../../components/layout/Sidebar";
import Navbar from "../../components/layout/Navbar";

import TimetableHeader from "../../components/timetable/TimetableHeader";
import TimetableControls from "../../components/timetable/TimetableControls";
import TimetableGrid from "../../components/timetable/TimetableGrid";
import TodaySchedule from "../../components/timetable/TodaySchedule";
import WeeklyStats from "../../components/timetable/WeeklyStats";

import { getTimetable } from "../../services/timetable.service";

import "../../styles/timetable.css";

export default function Timetable() {

  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {

    const fetchTimetable = async () => {

      try {

        const data = await getTimetable();
        console.log("Timetable data:", data);
        setClasses(data);

      } catch (error) {

        console.error(
          "Failed to fetch timetable",
          error
        );

      } finally {

        setLoading(false);

      }

    };

    fetchTimetable();

  }, []);

  return (
    <div className="timetable-layout">

      <Sidebar />

      <div className="timetable-content">

        <Navbar />

        <div className="timetable-wrapper">

          <TimetableHeader />

          <TimetableControls />

          {loading ? (

            <p>Loading timetable...</p>

          ) : (

            <TimetableGrid
              timetable={classes}
            />

          )}

          <div className="timetable-bottom">

            <TodaySchedule
              timetable={classes}
            />

            <WeeklyStats
              timetable={classes}
            />

          </div>

        </div>

      </div>

    </div>
  );
}