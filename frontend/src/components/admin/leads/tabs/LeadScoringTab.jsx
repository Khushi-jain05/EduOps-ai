import { card, badge } from "../leadsStyles";

export default function LeadScoringTab({ scoring }) {
  const maxCount = Math.max(1, ...scoring.map((b) => b.count));

  return (
    <div style={card}>
      <h2 style={{ marginTop: 0, color: "#172554" }}>Lead Scoring Breakdown</h2>
      <p style={{ color: "#64748B", marginTop: 0 }}>
        Distribution of leads and average score across each pipeline stage.
      </p>

      {scoring.map((bucket) => (
        <div key={bucket.status} style={{ marginBottom: "20px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
            <span style={badge(bucket.status)}>{bucket.status}</span>
            <span style={{ color: "#64748B", fontSize: "14px" }}>
              {bucket.count} leads • avg score {bucket.avgScore}
            </span>
          </div>

          <div style={{ background: "#F1F5F9", borderRadius: "999px", height: "10px" }}>
            <div
              style={{
                width: `${(bucket.count / maxCount) * 100}%`,
                background: "linear-gradient(135deg,#2563eb,#60a5fa)",
                height: "100%",
                borderRadius: "999px",
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
