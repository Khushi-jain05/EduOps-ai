import {
  MapPin
} from "lucide-react";

export default function TimetableCard({
  code,
  subject,
  room,
  faculty,
  color
}) {
  return (
    <div
      className="timetable-card"
      style={{
        background: color.bg,
        borderColor: color.border,
      }}
    >
      <span className="course-code">
        {code}
      </span>

      <h4>{subject}</h4>

      <p>
        <MapPin size={14} />
        {room}
      </p>

      <small>{faculty}</small>
    </div>
  );
}