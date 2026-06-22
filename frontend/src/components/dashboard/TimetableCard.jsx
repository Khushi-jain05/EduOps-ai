import { Clock } from "lucide-react";

const classesToday = [
  {
    time: "09:00",
    subject: "Data Structures",
    room: "CS-201",
    faculty: "Dr. Mehta",
  },
  {
    time: "11:00",
    subject: "DBMS",
    room: "CS-105",
    faculty: "Prof. Iyer",
  },
  {
    time: "14:00",
    subject: "Operating Systems",
    room: "CS-301",
    faculty: "Dr. Khan",
  },
];

export default function TimetableCard() {
  return (
    <div className="white-card">
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "20px",
        }}
      >
        <div>
          <h2>Today's timetable</h2>
          <p>Your scheduled classes for today</p>
        </div>

        <button>View full week</button>
      </div>

      {classesToday.map((item) => (
        <div
          key={item.time}
          style={{
            display: "flex",
            alignItems: "center",
            padding: "20px 0",
            borderBottom: "1px solid #eee",
          }}
        >
          <div
            style={{
              width: "50px",
              height: "50px",
              borderRadius: "15px",
              background:
                "linear-gradient(135deg,#2563eb,#3b82f6)",
              color: "white",
              display: "grid",
              placeItems: "center",
              marginRight: "15px",
            }}
          >
            {item.time}
          </div>

          <div style={{ flex: 1 }}>
            <strong>{item.subject}</strong>
            <p>
              {item.faculty} • Room {item.room}
            </p>
          </div>

          <span>
            <Clock size={15} />
            60 min
          </span>
        </div>
      ))}
    </div>
  );
}