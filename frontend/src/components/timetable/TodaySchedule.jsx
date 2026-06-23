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

export default function TodaySchedule({ timetableData = [], onViewAll = () => {} }) {
  const today = useMemo(() => {
    const d = new Date();
    return ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"][d.getDay()];
  }, []);

  const todayClasses = useMemo(() => {
    return (
      timetableData
        .filter((c) => (c.day || "").toString().toLowerCase().startsWith(today.slice(0, 3).toLowerCase()) || (c.day || "").toString().toLowerCase() === today.toLowerCase())
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
          <div className="today-time">{item.startTime}</div>

          <div className="subject-icon" style={{ background: getColor(item.category) }}>
            <BookOpen size={18} />
          </div>

          <div className="subject-info">
            <h4>{item.subject}</h4>
            <p>{item.faculty} · {item.room}</p>
          </div>

          <div className="duration">
            <Clock3 size={14} />
            {item.duration ? `${item.duration}h` : '1h'}
          </div>
        </div>
      ))}

      {todayClasses.length === 0 && <p>No classes for today</p>}
    </div>
  );
}
