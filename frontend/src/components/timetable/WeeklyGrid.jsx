import TimetableCard from "./TimetableCard";

const timetableData = [
  {
    day: "Mon",
    time: "08:00",
    code: "MTH-201",
    subject: "Linear Algebra",
    room: "B-204",
    faculty: "Dr. R. Iyer",
    color: {
      bg: "#dbeafe",
      border: "#93c5fd",
    },
  },
  {
    day: "Mon",
    time: "09:00",
    code: "CS-211",
    subject: "Data Structures",
    room: "Lab 3",
    faculty: "Prof. A. Khan",
    color: {
      bg: "#f3e8ff",
      border: "#d8b4fe",
    },
  },
  {
    day: "Tue",
    time: "08:00",
    code: "PHY-202",
    subject: "Physics II",
    room: "B-301",
    faculty: "Dr. S. Mehta",
    color: {
      bg: "#e0f2fe",
      border: "#7dd3fc",
    },
  },
  {
    day: "Thu",
    time: "09:00",
    code: "CS-221",
    subject: "Database Systems",
    room: "Lab 1",
    faculty: "Dr. N. Verma",
    color: {
      bg: "#dcfce7",
      border: "#86efac",
    },
  },
  {
    day: "Fri",
    time: "08:00",
    code: "CS-231",
    subject: "Operating Systems",
    room: "B-105",
    faculty: "Prof. K. Joshi",
    color: {
      bg: "#f3e8ff",
      border: "#d8b4fe",
    },
  },
];

const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const times = [
  "08:00",
  "09:00",
  "10:00",
  "11:00",
  "12:00",
  "13:00",
  "14:00",
  "15:00",
];

export default function WeeklyGrid() {
  return (
    <div className="weekly-grid">

      <div className="grid-header">
        <div className="time-col">TIME</div>

        {days.map((day) => (
          <div key={day}>{day}</div>
        ))}
      </div>

      {times.map((time) => (
        <div
          key={time}
          className="grid-row"
        >
          <div className="time-col">
            {time}
          </div>

          {days.map((day) => {
            const item = timetableData.find(
              (t) =>
                t.day === day &&
                t.time === time
            );

            return (
              <div
                key={day}
                className="grid-cell"
              >
                {item && (
                  <TimetableCard
                    {...item}
                  />
                )}
              </div>
            );
          })}
        </div>
      ))}

    </div>
  );
}