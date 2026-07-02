import { useEffect, useState, useMemo } from "react";

import Sidebar from "../../components/layout/Sidebar";
import Navbar from "../../components/layout/Navbar";
import AddEventModal from "../../components/timetable/AddEventModal";
import TimetableHeader from "../../components/timetable/TimetableHeader";
import TimetableControls from "../../components/timetable/TimetableControls";
import TimetableGrid from "../../components/timetable/TimetableGrid";
import TodaySchedule from "../../components/timetable/TodaySchedule";
import WeeklyStats from "../../components/timetable/WeeklyStats";

import { getTimetable } from "../../services/timetable.service";

import "../../styles/timetable.css";

function normalizeDay(raw) {
  if (!raw) return null;
  const s = raw.toString().trim().toLowerCase();
  const map = {
    mon: "Monday",
    monday: "Monday",
    tue: "Tuesday",
    tues: "Tuesday",
    tuesday: "Tuesday",
    wed: "Wednesday",
    weds: "Wednesday",
    wednesday: "Wednesday",
    thu: "Thursday",
    thur: "Thursday",
    thurs: "Thursday",
    thursday: "Thursday",
    fri: "Friday",
    friday: "Friday",
    sat: "Saturday",
    saturday: "Saturday",
    sun: "Sunday",
    sunday: "Sunday",
  };
  return map[s] || null;
}

function formatWeekLabel(startDate) {
  const start = new Date(startDate);
  const end = new Date(start);
  end.setDate(start.getDate() + 6);
  const opts = { month: "short", day: "numeric" };
  return `${start.toLocaleDateString(undefined, opts)} – ${end.toLocaleDateString(undefined, opts)}`;
}

function dateKey(value) {
  return new Date(value).toISOString().slice(0, 10);
}

function isInSelectedWeek(value, weekStart) {
  if (!value) return true;

  const current = new Date(value);
  const start = new Date(weekStart);
  const end = new Date(weekStart);
  end.setDate(start.getDate() + 6);
  start.setHours(0, 0, 0, 0);
  end.setHours(23, 59, 59, 999);

  return current >= start && current <= end;
}

export default function Timetable() {

  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);

  const [viewMode, setViewMode] = useState("week");
  const [showAddModal, setShowAddModal] = useState(false);
const [selectedCategories, setSelectedCategories] = useState([]);
  const [weekStart, setWeekStart] = useState(() => {
    const d = new Date();
    // set to monday
    const day = d.getDay();
    const diff = (day + 6) % 7; // days since monday
    d.setDate(d.getDate() - diff);
    d.setHours(0, 0, 0, 0);
    return d;
  });

  useEffect(() => {
    const fetchTimetable = async () => {
      try {
        const data = await getTimetable();
        console.log("Timetable data:", data);
        setClasses(data || []);
      } catch (error) {
        console.error("Failed to fetch timetable", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTimetable();
  }, []);

  const weekLabel = useMemo(() => formatWeekLabel(weekStart), [weekStart]);

  const prevWeek = () => {
    setWeekStart((s) => {
      const n = new Date(s);
      n.setDate(n.getDate() - 7);
      return n;
    });
  };

  const nextWeek = () => {
    setWeekStart((s) => {
      const n = new Date(s);
      n.setDate(n.getDate() + 7);
      return n;
    });
  };

  const onFilter = () => {
  const input = prompt(
    "Enter categories separated by comma\nExample:\nMathematics,Physics"
  );

  if (!input) {
    setSelectedCategories([]);
    return;
  }

  const categories = input
    .split(",")
    .map((c) => c.trim());

  setSelectedCategories(categories);
};

  const onExport = () => {
    // simple CSV export
    const rows = classes.map((c) => ({
      subject: c.subject,
      faculty: c.faculty,
      room: c.room,
      day: c.day,
      startTime: c.startTime,
      duration: c.duration,
      category: c.category,
    }));

    const header = Object.keys(rows[0] || {}).join(",");
    const csv = [header]
      .concat(rows.map((r) => Object.values(r).map((v) => `"${String(v || "").replace(/"/g, '""')}"`).join(",")))
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `timetable-export-${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  const onAddEvent = () => {
  setShowAddModal(true);
};

  const todayFull = useMemo(() => {
    const d = new Date();
    const map = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    return map[d.getDay()];
  }, []);

  const filtered = useMemo(() => {
  let result = [...classes];

  result = result.filter((item) => {
    if (item.source !== "lesson_plan") {
      return true;
    }

    const lessonDate = item.lesson_plans?.lesson_date;

    if (!lessonDate) {
      return true;
    }

    if (viewMode === "day") {
      return dateKey(lessonDate) === dateKey(new Date());
    }

    return isInSelectedWeek(lessonDate, weekStart);
  });

  if (viewMode === "day") {
    result = result.filter(
      (c) => normalizeDay(c.day) === todayFull
    );
  }

  if (selectedCategories.length > 0) {
    result = result.filter((c) =>
      selectedCategories.includes(c.category)
    );
  }

  return result;
}, [
  classes,
  viewMode,
  todayFull,
  weekStart,
  selectedCategories,
]);
  return (
    <div className="timetable-layout">
      <Sidebar />

      <div className="timetable-content">
        <Navbar />

        <div className="timetable-wrapper">
          <TimetableHeader
            viewMode={viewMode}
            setViewMode={setViewMode}
            onFilter={onFilter}
            onExport={onExport}
            onAddEvent={onAddEvent}
          />

          <TimetableControls prevWeek={prevWeek} nextWeek={nextWeek} weekLabel={weekLabel} />

          {loading ? (
            <p>Loading timetable...</p>
          ) : (
            <TimetableGrid timetable={filtered} />
          )}

          <div className="timetable-bottom">
            <TodaySchedule timetableData={classes} />

            <WeeklyStats timetableData={classes} />
          </div>
          <AddEventModal
  open={showAddModal}
  onClose={() => setShowAddModal(false)}
  onSuccess={async () => {
    const data = await getTimetable();
    setClasses(data || []);
  }}
/>
        </div>
      </div>
    </div>
  );
}
