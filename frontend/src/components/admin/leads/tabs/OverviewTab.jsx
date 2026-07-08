import { card, badge } from "../leadsStyles";

export default function OverviewTab({ leads, activity }) {
  const recentLeads = leads.slice(0, 5);
  const recentActivity = activity.slice(0, 5);

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1.3fr 1fr", gap: "20px" }}>
      <div style={card}>
        <h2 style={{ marginTop: 0, color: "#172554" }}>Recent Leads</h2>

        {recentLeads.length === 0 ? (
          <p style={{ color: "#94a3b8" }}>No leads yet — add your first lead to get started.</p>
        ) : (
          recentLeads.map((lead) => (
            <div
              key={lead.id}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "14px 0",
                borderTop: "1px solid #F1F5F9",
              }}
            >
              <div>
                <strong>{lead.name}</strong>
                <p style={{ margin: "4px 0 0", color: "#64748B" }}>
                  {lead.course || "No course"} • {lead.city || "Unknown city"}
                </p>
              </div>
              <span style={badge(lead.status)}>{lead.status}</span>
            </div>
          ))
        )}
      </div>

      <div style={card}>
        <h2 style={{ marginTop: 0, color: "#172554" }}>Recent Activity</h2>

        {recentActivity.length === 0 ? (
          <p style={{ color: "#94a3b8" }}>No activity yet.</p>
        ) : (
          recentActivity.map((item) => (
            <div key={item.id} style={{ padding: "12px 0", borderTop: "1px solid #F1F5F9" }}>
              <strong>{item.Lead?.name || "Unknown lead"}</strong>
              <p style={{ margin: "4px 0 0", color: "#64748B" }}>{item.message}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
