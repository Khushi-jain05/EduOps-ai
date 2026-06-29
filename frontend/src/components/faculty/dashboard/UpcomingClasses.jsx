import { FiClock, FiMapPin } from "react-icons/fi";

const classes = [
  {
    time: "10:00 AM",
    subject: "Database Management Systems",
    room: "Room A-204",
  },
  {
    time: "01:00 PM",
    subject: "Operating Systems",
    room: "Lab B-102",
  },
  {
    time: "03:30 PM",
    subject: "Faculty Office Hours",
    room: "Cabin F-12",
  },
];

export default function UpcomingClasses() {
  return (
    <div
      style={{
        background: "#fff",
        borderRadius: "24px",
        padding: "28px",
        boxShadow: "0 10px 25px rgba(0,0,0,.04)",
      }}
    >
      <h2
        style={{
          margin: 0,
          color: "#111827",
          fontSize: "26px",
        }}
      >
        Upcoming Classes
      </h2>

      <p
        style={{
          color: "#64748B",
          marginTop: "8px",
          marginBottom: "25px",
        }}
      >
        Today's schedule
      </p>

      {classes.map((item) => (
        <div
          key={item.time}
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "18px 0",
            borderBottom: "1px solid #EEF2F7",
          }}
        >
          <div>
            <h4
              style={{
                margin: 0,
                color: "#111827",
              }}
            >
              {item.subject}
            </h4>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "15px",
                marginTop: "8px",
                color: "#64748B",
                fontSize: "14px",
              }}
            >
              <span
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "5px",
                }}
              >
                <FiClock />
                {item.time}
              </span>

              <span
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "5px",
                }}
              >
                <FiMapPin />
                {item.room}
              </span>
            </div>
          </div>

          <button
            style={{
              background: "#2563EB",
              color: "#fff",
              border: "none",
              borderRadius: "10px",
              padding: "10px 18px",
              cursor: "pointer",
              fontWeight: "600",
            }}
          >
            View
          </button>
        </div>
      ))}
    </div>
  );
}