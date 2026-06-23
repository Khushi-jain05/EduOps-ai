import TimetableCard from "./TimetableCard";

export default function TimetableGrid({
  timetable = [],
}) {

  const days = [
    "Mon",
    "Tue",
    "Wed",
    "Thu",
    "Fri",
    "Sat",
  ];

  const getColor = (category) => {

    switch (category) {

      case "Mathematics":
        return {
          bg: "#dbeafe",
          border: "#93c5fd",
        };

      case "Computer Science":
        return {
          bg: "#f3e8ff",
          border: "#d8b4fe",
        };

      case "Physics":
        return {
          bg: "#e0f2fe",
          border: "#7dd3fc",
        };

      case "Labs":
        return {
          bg: "#dcfce7",
          border: "#86efac",
        };

      default:
        return {
          bg: "#fef3c7",
          border: "#fbbf24",
        };
    }
  };

  return (
    <div className="tt-grid">

      <div className="tt-row tt-head">
        <div>Time</div>

        {days.map((day) => (
          <div key={day}>{day}</div>
        ))}
      </div>

      {[8,9,10,11,12,13,14,15,16].map(
        (hour) => (
          <div
            key={hour}
            className="tt-row"
          >
            <div>{hour}:00</div>

            {days.map((day) => {

              const classItem =
                timetable.find(
                  (item) =>
                    item.day === day &&
                    parseInt(
                      item.startTime.split(":")[0]
                    ) === hour
                );

              return (
                <div
                  key={day}
                  className="tt-cell"
                >

                  {classItem && (

                    <TimetableCard
                      code={
                        classItem.code ||
                        classItem.subject
                      }
                      subject={
                        classItem.subject
                      }
                      room={
                        classItem.room
                      }
                      faculty={
                        classItem.faculty
                      }
                      color={
                        getColor(
                          classItem.category
                        )
                      }
                    />

                  )}

                </div>
              );
            })}
          </div>
        )
      )}

    </div>
  );
}