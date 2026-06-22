import {
  BookOpen,
  Clock3,
} from "lucide-react";

const todayClasses = [
  {
    time: "08:00",
    subject: "Linear Algebra",
    faculty: "Dr. R. Iyer",
    room: "B-204",
    duration: "1h",
    color: "#dbeafe",
  },
  {
    time: "09:00",
    subject: "Data Structures",
    faculty: "Prof. A. Khan",
    room: "Lab 3",
    duration: "2h",
    color: "#e9d5ff",
  },
  {
    time: "13:00",
    subject: "English Comm.",
    faculty: "Ms. P. Rao",
    room: "A-110",
    duration: "1h",
    color: "#fde7c7",
  },
];

export default function TodaySchedule() {
  return (
    <div className="today-card">

      <div className="today-header">
        <div>
          <h3>Today · Monday, Jun 22</h3>
          <p>4 classes · 1 lab · ends 4:00 PM</p>
        </div>

        <button>View all</button>
      </div>

      {todayClasses.map((item, index) => (
        <div
          key={index}
          className="today-row"
        >
          <div className="today-time">
            {item.time}
          </div>

          <div
            className="subject-icon"
            style={{
              background: item.color,
            }}
          >
            <BookOpen size={18} />
          </div>

          <div className="subject-info">
            <h4>{item.subject}</h4>

            <p>
              {item.faculty} · {item.room}
            </p>
          </div>

          <div className="duration">
            <Clock3 size={14} />
            {item.duration}
          </div>
        </div>
      ))}

    </div>
  );
}