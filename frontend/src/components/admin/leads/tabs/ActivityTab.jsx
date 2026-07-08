import { card } from "../leadsStyles";

const timeAgo = (date) => {
  const diffMs = Date.now() - new Date(date).getTime();
  const minutes = Math.round(diffMs / 60000);

  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes}m ago`;

  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours}h ago`;

  const days = Math.round(hours / 24);
  return `${days}d ago`;
};

export default function ActivityTab({ activity }) {
  return (
    <div style={card}>
      <h2 style={{ marginTop: 0, color: "#172554" }}>Activity</h2>

      {activity.length === 0 ? (
        <p style={{ color: "#94a3b8" }}>No activity yet.</p>
      ) : (
        activity.map((item) => (
          <div
            key={item.id}
            style={{
              display: "flex",
              justifyContent: "space-between",
              padding: "14px 0",
              borderTop: "1px solid #F1F5F9",
            }}
          >
            <div>
              <strong>{item.Lead?.name || "Unknown lead"}</strong>
              <p style={{ margin: "4px 0 0", color: "#64748B" }}>{item.message}</p>
            </div>
            <span style={{ color: "#94a3b8", fontSize: "13px", whiteSpace: "nowrap" }}>
              {timeAgo(item.created_at)}
            </span>
          </div>
        ))
      )}
    </div>
  );
}
