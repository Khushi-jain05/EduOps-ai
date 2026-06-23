import {
  ChevronLeft,
  ChevronRight,
  CalendarDays,
} from "lucide-react";

export default function TimetableControls({
  prevWeek = () => {},
  nextWeek = () => {},
  weekLabel = "",
}) {
  return (
    <div className="timetable-controls">

      <div className="week-nav">
        <button onClick={prevWeek}>
          <ChevronLeft size={18} />
        </button>

        <button onClick={nextWeek}>
          <ChevronRight size={18} />
        </button>

        <div className="week-label">
          <CalendarDays size={18} />
          {weekLabel || ""}
        </div>
      </div>

      <div className="legend">
        <span>
          <i
            style={{
              background: "#93c5fd",
            }}
          />
          Mathematics
        </span>

        <span>
          <i
            style={{
              background: "#d8b4fe",
            }}
          />
          Computer Science
        </span>

        <span>
          <i
            style={{
              background: "#7dd3fc",
            }}
          />
          Physics
        </span>

        <span>
          <i
            style={{
              background: "#86efac",
            }}
          />
          Labs
        </span>

        <span>
          <i
            style={{
              background: "#fdba74",
            }}
          />
          Languages
        </span>

        <span>
          <i
            style={{
              background: "#f9a8d4",
            }}
          />
          Other
        </span>
      </div>
    </div>
  );
}
