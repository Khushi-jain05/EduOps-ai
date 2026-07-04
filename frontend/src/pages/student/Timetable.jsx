import { useEffect, useState, useMemo } from "react";

import Sidebar from "../../components/layout/Sidebar";
import Navbar from "../../components/layout/Navbar";
import TimetableHeader from "../../components/timetable/TimetableHeader";
import TimetableControls from "../../components/timetable/TimetableControls";
import TimetableGrid from "../../components/timetable/TimetableGrid";
import TodaySchedule from "../../components/timetable/TodaySchedule";
import WeeklyStats from "../../components/timetable/WeeklyStats";

import { getStudentLectures } from "../../services/lecture.service";

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
  if (!value) return "";

  if (typeof value === "string") {
    return value.slice(0, 10);
  }

  const year = value.getFullYear();
  const month = String(value.getMonth() + 1).padStart(2, "0");
  const day = String(value.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function getLessonDate(item) {
  return (
    item.lessonDate ||
    item.eventDate ||
    item.lesson_plans?.lesson_date
  );
}

function getUser() {
  try {
    return JSON.parse(localStorage.getItem("user"));
  } catch {
    return null;
  }
}

function formatFaculty(lecture) {
  return (
    lecture.User?.username ||
    lecture.Subject?.faculty ||
    "Faculty"
  );
}

function minutesBetween(start, end) {
  if (!start || !end) return 60;

  const startDate = new Date(`1970-01-01T${start}:00`);
  const endDate = new Date(`1970-01-01T${end}:00`);

  return Math.max(1, Math.round((endDate - startDate) / 60000));
}

function dayName(date) {
  return new Date(`${date}T00:00:00`).toLocaleDateString("en-US", {
    weekday: "long",
  });
}

function formatTime(time) {
  return time
    ? new Date(`1970-01-01T${time}:00`).toLocaleTimeString([], {
        hour: "numeric",
        minute: "2-digit",
      })
    : "";
}

function lectureToEvent(lecture) {
  return {
    id: lecture.id,
    code: lecture.Subject?.code || lecture.Subject?.name || "Lecture",
    subject: lecture.Subject?.name || "Lecture",
    title: lecture.title,
    faculty: formatFaculty(lecture),
    room: lecture.classroom || lecture.meeting_link || "TBA",
    meeting_link: lecture.meeting_link,
    description: lecture.description,
    day: dayName(lecture.date),
    lessonDate: lecture.date,
    startTime: lecture.start_time,
    endTime: lecture.end_time,
    duration: minutesBetween(lecture.start_time, lecture.end_time),
    category: lecture.Subject?.name || "Lecture",
    source: "lecture",
    lecture,
  };
}

function isInSelectedWeek(value, weekStart) {
  if (!value) return true;

  const start = new Date(weekStart);
  const end = new Date(weekStart);
  end.setDate(start.getDate() + 6);

  const currentKey = dateKey(value);

  return (
    currentKey >= dateKey(start) &&
    currentKey <= dateKey(end)
  );
}

export default function Timetable() {

  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedLecture, setSelectedLecture] = useState(null);

  const [viewMode, setViewMode] = useState("week");
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
    let active = true;

    const fetchLectures = async () => {
      try {
        const user = getUser();

        if (!user?.id) {
          setClasses([]);
          return;
        }

        const data = await getStudentLectures(user.id);
        const events = Array.isArray(data) ? data.map(lectureToEvent) : [];

        if (active) {
          setClasses(events);
        }
      } catch (error) {
        console.error("Failed to fetch lectures", error);
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    fetchLectures();

    const onFocus = () => fetchLectures();
    const interval = window.setInterval(fetchLectures, 15000);

    window.addEventListener("focus", onFocus);

    return () => {
      active = false;
      window.clearInterval(interval);
      window.removeEventListener("focus", onFocus);
    };
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
      endTime: c.endTime,
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

  const todayFull = useMemo(() => {
    const d = new Date();
    const map = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    return map[d.getDay()];
  }, []);

  const filtered = useMemo(() => {
  let result = [...classes];

  result = result.filter((item) => {
    const lessonDate = getLessonDate(item);

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
          />

          <TimetableControls prevWeek={prevWeek} nextWeek={nextWeek} weekLabel={weekLabel} />

          {loading ? (
            <p>Loading timetable...</p>
          ) : (
            <TimetableGrid
              timetable={filtered}
              weekStart={weekStart}
              onEventClick={setSelectedLecture}
            />
          )}

          <div className="timetable-bottom">
            <TodaySchedule timetableData={classes} />

            <WeeklyStats timetableData={classes} />
          </div>
          {selectedLecture && (
            <div
              className="modal-overlay"
              onClick={() => setSelectedLecture(null)}
            >
              <div
                className="lecture-detail-card"
                onClick={(event) => event.stopPropagation()}
              >
                <div>
                  <span className="tt-label">LECTURE</span>
                  <h2>{selectedLecture.title}</h2>
                </div>

                <div className="lecture-detail-grid">
                  <span>Subject</span>
                  <strong>{selectedLecture.subject}</strong>

                  <span>Faculty</span>
                  <strong>{selectedLecture.faculty}</strong>

                  <span>Date</span>
                  <strong>{dateKey(getLessonDate(selectedLecture))}</strong>

                  <span>Time</span>
                  <strong>
                    {formatTime(selectedLecture.startTime)} -{" "}
                    {formatTime(selectedLecture.endTime)}
                  </strong>

                  <span>Classroom</span>
                  <strong>{selectedLecture.room || "TBA"}</strong>
                </div>

                {selectedLecture.description && (
                  <p>{selectedLecture.description}</p>
                )}

                {selectedLecture.meeting_link && (
                  <a
                    href={selectedLecture.meeting_link}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Open meeting link
                  </a>
                )}

                <button onClick={() => setSelectedLecture(null)}>
                  Close
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
