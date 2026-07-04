import TimetableCard from "./TimetableCard";

export default function TimetableGrid({
  timetable = [],
  weekStart,
  onEventClick = () => {},
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

  const dateKey = (value) => {
    if (!value) return "";

    if (typeof value === "string") {
      return value.slice(0, 10);
    }

    const year = value.getFullYear();
    const month = String(value.getMonth() + 1).padStart(2, "0");
    const day = String(value.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  };

  const getLessonDate = (item) =>
    item.lessonDate ||
    item.eventDate ||
    item.lesson_plans?.lesson_date;

  const hours = Array.from(
    new Set([
      ...Array.from({ length: 11 }, (_, index) => index + 8),
      ...timetable
        .map((item) => parseInt(item.startTime?.split(":")[0], 10))
        .filter((hour) => Number.isInteger(hour)),
    ])
  ).sort((a, b) => a - b);

  const formatHour = (hour) =>
    new Date(`1970-01-01T${String(hour).padStart(2, "0")}:00:00`)
      .toLocaleTimeString([], {
        hour: "numeric",
        minute: "2-digit",
      });

  const cellDateKey = (dayIndex) => {
    const start = weekStart ? new Date(weekStart) : new Date();
    start.setHours(0, 0, 0, 0);

    if (!weekStart) {
      const diff = (start.getDay() + 6) % 7;
      start.setDate(start.getDate() - diff);
    }

    start.setDate(start.getDate() + dayIndex);

    return dateKey(start);
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

      {hours.map(
        (hour) => (
          <div
            key={hour}
            className="tt-row"
          >
            <div>{formatHour(hour)}</div>

            {days.map((day, dayIndex) => {

              const classItem = timetable.find((item) => {
  const lessonDate = getLessonDate(item);

  const dayMatch =
    lessonDate
      ? dateKey(lessonDate) === cellDateKey(dayIndex)
      : normalizeDay(item.day) ===
        normalizeDay(dayMap[day]);

  const timeMatch =
    parseInt(item.startTime?.split(":")[0]) ===
    hour;

  return dayMatch && timeMatch;
});

              return (
                <div
                  key={`${day}-${hour}`}
                  className="tt-cell"
                >

                  {classItem ? (

                    <TimetableCard
                      onClick={() => onEventClick(classItem)}
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
