import {
  Filter,
  Download,
  Plus
} from "lucide-react";

export default function TimetableHeader() {
  return (
    <div className="tt-header">

      <div>
        <span className="tt-label">
          SCHEDULE
        </span>

        <h1>My Timetable</h1>

        <p>
          Week view of classes, labs and co-curriculars.
          Tap a block to see details.
        </p>
      </div>

      <div className="tt-actions">

        <button className="active">
          Week
        </button>

        <button>
          Day
        </button>

        <button>
          <Filter size={16}/>
          Filter
        </button>

        <button>
          <Download size={16}/>
          Export
        </button>

        <button className="primary">
          <Plus size={16}/>
          Add event
        </button>

      </div>

    </div>
  );
}