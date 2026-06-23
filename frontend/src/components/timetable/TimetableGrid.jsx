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

  const normalizeDay = (day) => {

    const map = {
      mon: "monday",
      monday: "monday",

      tue: "tuesday",
      tues: "tuesday",
      tuesday: "tuesday",

      wed: "wednesday",
      weds: "wednesday",
      wednesday: "wednesday",

      thu: "thursday",
      thur: "thursday",
      thurs: "thursday",
      thursday: "thursday",

      fri: "friday",
      friday: "friday",

      sat: "saturday",
      saturday: "saturday",
    };

    return map[
      day?.toLowerCase()?.trim()
    ];
  };

  const dayMap = {
    Mon: "Monday",
    Tue: "Tuesday",
    Wed: "Wednesday",
    Thu: "Thursday",
    Fri: "Friday",
    Sat: "Saturday",
  };

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

      case "Languages":
        return {
          bg: "#ffedd5",
          border: "#fdba74",
        };

      default:
        return {
          bg: "#fce7f3",
          border: "#f9a8d4",
        };
    }
  };

  return (
    <div className="tt-grid">

      <div className="tt-row tt-head">
        <div>Time</div>

        {days.map((day) => (
          <div key={day}>
            {day}
          </div>
        ))}
      </div>

      {[8, 9, 10, 11, 12, 13, 14, 15, 16].map(
        (hour) => (
          <div
            key={hour}
            className="tt-row"
          >
            <div>{hour}:00</div>

            {days.map((day) => {

              const classItem = timetable.find((item) => {
  const dayMatch =
    normalizeDay(item.day) ===
    normalizeDay(dayMap[day]);

  const timeMatch =
    parseInt(item.startTime?.split(":")[0]) ===
    hour;

  if (dayMatch && timeMatch) {
    console.log("MATCH FOUND", item);
  }

  return dayMatch && timeMatch;
});

              return (
                <div
                  key={`${day}-${hour}`}
                  className="tt-cell"
                >

                  {classItem ? (

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

                  ) : (

                    <div className="tt-empty">
                      No Classes
                    </div>

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