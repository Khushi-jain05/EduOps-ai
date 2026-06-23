import TimetableCard from "./TimetableCard";

export default function TimetableGrid({ timetable = [] }) {
  const days = [
    { abbr: "Mon", full: "Monday" },
    { abbr: "Tue", full: "Tuesday" },
    { abbr: "Wed", full: "Wednesday" },
    { abbr: "Thu", full: "Thursday" },
    { abbr: "Fri", full: "Friday" },
    { abbr: "Sat", full: "Saturday" },
  ];

  const normalizeDay = (raw) => {
    if (!raw) return null;
    const s = raw.toString().trim().toLowerCase();
    const map = {
      mon: "Monday",
      monday: "Monday",
      tue: "Tuesday",
      tues: "Tuesday",
      tuesday: "Tuesday",
      wed: "Wednesday",
      weds: "Wednesday",
      wednesday: "Wednesday",
      thu: "Thursday",
      thur: "Thursday",
      thurs: "Thursday",
      thursday: "Thursday",
      fri: "Friday",
      friday: "Friday",
      sat: "Saturday",
      saturday: "Saturday",
      sun: "Sunday",
      sunday: "Sunday",
    };
    return map[s] || null;
  };

  const getColor = (category) => {
    const cat = (category || "").toString().trim().toLowerCase();
    if (cat.includes("math")) return { bg: "#dbeafe", border: "#93c5fd" };
    if (cat.includes("computer") || cat.includes("cs"))
      return { bg: "#f3e8ff", border: "#d8b4fe" };
    if (cat.includes("phys")) return { bg: "#e0f2fe", border: "#7dd3fc" };
    if (cat.includes("lab")) return { bg: "#dcfce7", border: "#86efac" };
    // default / other
    return { bg: "#fef3c7", border: "#fbbf24" };
  };

  const hourList = [8, 9, 10, 11, 12, 13, 14, 15, 16];

  return (
    <div className="tt-grid">
      <div className="tt-row tt-head">
        <div>Time</div>
        {days.map((d) => (
          <div key={d.full}>{d.abbr}</div>
        ))}
      </div>

      {hourList.map((hour) => (
        <div key={hour} className="tt-row">
          <div>{hour}:00</div>

          {days.map((d) => {
            const classItem = timetable.find((item) => {
              const itemDay = normalizeDay(item?.day || item?.dayOfWeek || "");
              const itemHour = parseInt((item?.startTime || "0").toString().split(":")[0], 10);
              return itemDay === d.full && itemHour === hour;
            });

            return (
              <div key={d.full} className="tt-cell">
                {classItem && (
                  <TimetableCard
                    code={classItem.code || classItem.subject}
                    subject={classItem.subject}
                    room={classItem.room}
                    faculty={classItem.faculty}
                    color={getColor(classItem.category)}
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