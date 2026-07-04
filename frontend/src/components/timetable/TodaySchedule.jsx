import { BookOpen, Clock3 } from "lucide-react";
import { useMemo } from "react";

const getColor = (category) => {
  const cat = (category || "").toString().toLowerCase();
  if (cat.includes("math")) return "#dbeafe";
  if (cat.includes("computer") || cat.includes("cs")) return "#e9d5ff";
  if (cat.includes("phys")) return "#e0f2fe";
  if (cat.includes("lab")) return "#dcfce7";
  return "#fde7c7";
};

const dateKey = (value) => {
  if (!value) return "";

  if (typeof value === "string") {
    return value.slice(0, 10);
  }

  const year = value.getFullYear();
  const month = String(value.getMonth() + 1).padStart(2, "0");
  const day = String(value.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

const getLessonDate = (item) =>
  item.lessonDate ||
  item.eventDate ||
  item.lesson_plans?.lesson_date;

const formatTime = (time) =>
  time
    ? new Date(`1970-01-01T${time}:00`).toLocaleTimeString([], {
        hour: "numeric",
        minute: "2-digit",
      })
    : "";

const formatDuration = (minutes) =>
  Number(minutes) >= 60 && Number(minutes) % 60 === 0
    ? `${Number(minutes) / 60}h`
    : `${minutes || 60} min`;

export default function TodaySchedule({ timetableData = [], onViewAll = () => {} }) {
  const today = useMemo(() => {
    const d = new Date();
    return ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"][d.getDay()];
  }, []);

  const todayClasses = useMemo(() => {
    const todayKey = dateKey(new Date());

    return (
      timetableData
        .filter((c) => {
          const lessonDate = getLessonDate(c);

          if (c.source === "lesson_plan" && lessonDate) {
            return dateKey(lessonDate) === todayKey;
          }

          return (c.day || "").toString().toLowerCase().startsWith(today.slice(0, 3).toLowerCase()) || (c.day || "").toString().toLowerCase() === today.toLowerCase();
        })
        .sort((a, b) => a.startTime.localeCompare(b.startTime)) || []
    );
  }, [timetableData, today]);

  return (
    <div className="today-card">
      <div className="today-header">
        <div>
          <h3>Today · {today}, {new Date().toLocaleDateString()}</h3>
          <p>{todayClasses.length} classes · ends 4:00 PM</p>
        </div>

        <button onClick={() => onViewAll(todayClasses)}>View all</button>
      </div>

      {todayClasses.map((item, index) => (
        <div key={item.id || index} className="today-row">
          <div className="today-time">{formatTime(item.startTime)}</div>

          <div className="subject-icon" style={{ background: getColor(item.category) }}>
            <BookOpen size={18} />
          </div>

          <div className="subject-info">
            <h4>{item.subject}</h4>
            <p>{item.faculty} · {item.room}</p>
          </div>

          <div className="duration">
            <Clock3 size={14} />
            {formatDuration(item.duration)}
          </div>
        </div>
      ))}

      {todayClasses.length === 0 && <p>No classes for today</p>}
    </div>
  );
}
