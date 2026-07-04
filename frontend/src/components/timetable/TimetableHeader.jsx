import {
  Filter,
  Download,
  Plus
} from "lucide-react";

export default function TimetableHeader({
  viewMode = "week",
  setViewMode = () => {},
  onFilter = () => {},
  onExport = () => {},
  onAddEvent = () => {},
  showAddEvent = false,
}) {
  return (
    <div className="tt-header">

      <div>
        <span className="tt-label">SCHEDULE</span>

        <h1>My Timetable</h1>

        <p>
          Week view of classes, labs and co-curriculars. Tap a block to see
          details.
        </p>
      </div>

      <div className="tt-actions">
        <button
          className={viewMode === "week" ? "active" : ""}
          onClick={() => setViewMode("week")}
        >
          Week
        </button>

        <button
          className={viewMode === "day" ? "active" : ""}
          onClick={() => setViewMode("day")}
        >
          Day
        </button>

        <button onClick={onFilter}>
          <Filter size={16} />
          Filter
        </button>

        <button onClick={onExport}>
          <Download size={16} />
          Export
        </button>

        {showAddEvent && (
          <button className="primary" onClick={onAddEvent}>
            <Plus size={16} />
            Add event
          </button>
        )}
      </div>
    </div>
  );
}
