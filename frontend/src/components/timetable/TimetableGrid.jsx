export default function TimetableGrid() {
  const days = [
    "Mon",
    "Tue",
    "Wed",
    "Thu",
    "Fri",
    "Sat",
  ];

  return (
    <div className="tt-grid">

      <div className="tt-row tt-head">
        <div>Time</div>

        {days.map((day) => (
          <div key={day}>{day}</div>
        ))}
      </div>

      {[8,9,10,11,12,13,14,15,16].map((hour) => (
        <div
          key={hour}
          className="tt-row"
        >
          <div>{hour}:00</div>

          {days.map((day) => (
            <div
              key={day}
              className="tt-cell"
            />
          ))}
        </div>
      ))}

    </div>
  );
}