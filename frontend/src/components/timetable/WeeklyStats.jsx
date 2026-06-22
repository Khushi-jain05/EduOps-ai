const stats = [
  {
    subject: "Computer Science",
    hours: 9,
    width: "78%",
    color: "#d8b4fe",
  },
  {
    subject: "Mathematics",
    hours: 4,
    width: "38%",
    color: "#93c5fd",
  },
  {
    subject: "Physics",
    hours: 4,
    width: "38%",
    color: "#7dd3fc",
  },
  {
    subject: "Labs",
    hours: 3,
    width: "28%",
    color: "#86efac",
  },
  {
    subject: "Languages",
    hours: 2,
    width: "18%",
    color: "#fdba74",
  },
  {
    subject: "Other",
    hours: 5,
    width: "48%",
    color: "#f9a8d4",
  },
];

export default function WeeklyStats() {
  return (
    <div className="weekly-card">

      <h3>This week at a glance</h3>

      <p>Hours by subject area</p>

      {stats.map((item) => (
        <div
          key={item.subject}
          className="stat-row"
        >
          <div className="stat-header">
            <span>{item.subject}</span>
            <span>{item.hours}h</span>
          </div>

          <div className="progress-bg">
            <div
              className="progress-fill"
              style={{
                width: item.width,
                background: item.color,
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}