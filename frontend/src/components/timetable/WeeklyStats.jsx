export default function WeeklyStats({ timetableData = [] }) {
  const getColor = (category) => {
    const cat = (category || "").toString().toLowerCase();
    if (cat.includes("math")) return "#93c5fd";
    if (cat.includes("computer") || cat.includes("cs")) return "#d8b4fe";
    if (cat.includes("phys")) return "#7dd3fc";
    if (cat.includes("lab")) return "#86efac";
    if (cat.includes("lang")) return "#fdba74";
    return "#f9a8d4";
  };

 
  const totals = {};
  timetableData.forEach((c) => {
    const key = c.category || "Other";
    const dur = Number(c.duration) || 1;
    totals[key] = (totals[key] || 0) + dur;
  });

  const entries = Object.keys(totals).map((k) => ({ subject: k, hours: totals[k], color: getColor(k) }));
  const totalHours = entries.reduce((s, e) => s + e.hours, 0) || 1;

  return (
    <div className="weekly-card">
      <h3>This week at a glance</h3>
      <p>Hours by subject area</p>

      {entries.map((item) => (
        <div key={item.subject} className="stat-row">
          <div className="stat-header">
            <span>{item.subject}</span>
            <span>{item.hours}h</span>
          </div>

          <div className="progress-bg">
            <div className="progress-fill" style={{ width: `${Math.round((item.hours / totalHours) * 100)}%`, background: item.color }} />
          </div>
        </div>
      ))}

      {entries.length === 0 && <p>No data for this week</p>}
    </div>
  );
}
