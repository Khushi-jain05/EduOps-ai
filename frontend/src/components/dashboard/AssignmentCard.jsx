const assignments = [
  {
    title: "Binary Trees — Problem Set 4",
    subject: "Data Structures",
    due: "Tomorrow",
  },
  {
    title: "ER Diagram Project",
    subject: "DBMS",
    due: "Fri",
  },
  {
    title: "Process Scheduling",
    subject: "OS",
    due: "Next Mon",
  },
];

export default function AssignmentCard() {
  return (
    <div className="white-card">
      <h2>Assignment deadlines</h2>

      {assignments.map((a) => (
        <div
          key={a.title}
          style={{
            background: "#fff",
            border: "1px solid #eee",
            borderRadius: "18px",
            padding: "15px",
            marginTop: "15px",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <div>
              <strong>{a.title}</strong>
              <p>{a.subject}</p>
            </div>

            <span
              style={{
                background: "#3b82f6",
                color: "white",
                borderRadius: "20px",
                padding: "5px 12px",
                fontSize: "12px",
              }}
            >
              {a.due}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}