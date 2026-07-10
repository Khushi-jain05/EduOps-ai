import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../components/layout/Sidebar";
import Navbar from "../../components/layout/Navbar";
import LeadScoringTab from "../../components/admin/leads/tabs/LeadScoringTab";
import { card } from "../../components/admin/leads/leadsStyles";
import { getLeadScoring, getLeadStats, getLeads } from "../../services/leads.service";
import { FiTarget, FiTrendingUp, FiUsers, FiArrowRight } from "react-icons/fi";

const BUCKETS = [
  {
    key: "hot",
    label: "Hot",
    emoji: "🔥",
    range: "80 – 100",
    gradient: "linear-gradient(135deg,#f97316,#dc2626)",
    recommendation: "Recommended: senior counselor call within 15m",
    test: (score) => score >= 80,
  },
  {
    key: "warm",
    label: "Warm",
    emoji: "⛅",
    range: "50 – 79",
    gradient: "linear-gradient(135deg,#f59e0b,#eab308)",
    recommendation: "Recommended: nurture sequence + WhatsApp",
    test: (score) => score >= 50 && score < 80,
  },
  {
    key: "cold",
    label: "Cold",
    emoji: "❄️",
    range: "0 – 49",
    gradient: "linear-gradient(135deg,#3b82f6,#0ea5e9)",
    recommendation: "Recommended: drip campaign + retarget",
    test: (score) => score < 50,
  },
];

const SCORING_GUIDE = [
  { signal: "Application form started", points: "+25" },
  { signal: "Visited fees page multiple times", points: "+18" },
  { signal: "Downloaded brochure", points: "+12" },
  { signal: "Replied to WhatsApp quickly", points: "+15" },
  { signal: "Booked a counseling slot", points: "+30" },
  { signal: "No engagement for 7+ days", points: "−20" },
  { signal: "Marked 'just researching'", points: "−10" },
];

export default function LeadScoringPage() {
  const navigate = useNavigate();
  const [scoring, setScoring] = useState([]);
  const [leads, setLeads] = useState([]);
  const [conversionRate, setConversionRate] = useState(0);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    try {
      const [scoringData, statsData, leadsData] = await Promise.all([
        getLeadScoring(),
        getLeadStats(),
        getLeads(),
      ]);
      setScoring(scoringData);
      setConversionRate(statsData.conversionRate);
      setLeads(leadsData);
    } catch (error) {
      console.error("Failed to load lead scoring", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const avgScore =
    leads.length > 0 ? Math.round(leads.reduce((sum, l) => sum + l.score, 0) / leads.length) : 0;
  const hotCount = leads.filter((l) => l.score >= 80).length;

  const topLeads = [...leads].sort((a, b) => b.score - a.score).slice(0, 5);

  return (
    <div style={{ display: "flex", height: "100vh", background: "#EEF6FF" }}>
      <Sidebar />

      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        <Navbar />

        <div style={{ flex: 1, overflowY: "auto", padding: "30px" }}>
          <div
            style={{
              background: "linear-gradient(135deg,#2563eb,#4f8ef7)",
              borderRadius: "26px",
              padding: "40px",
              color: "#fff",
              marginBottom: "20px",
            }}
          >
            <span
              style={{
                background: "rgba(255,255,255,.18)",
                padding: "6px 14px",
                borderRadius: "20px",
                fontSize: "13px",
              }}
            >
              Lead ops • Intent Scoring
            </span>
            <h1 style={{ margin: "18px 0 10px", fontSize: "36px" }}>AI Lead Intent Scoring</h1>
            <p style={{ opacity: 0.9, maxWidth: "700px", marginBottom: "26px" }}>
              Every lead is scored 0–100 from real engagement signals. Counselors focus only where
              conversion probability is highest.
            </p>

            <button
              onClick={() => navigate("/admin/leads")}
              style={{
                background: "#fff",
                color: "#2563eb",
                border: "none",
                borderRadius: "14px",
                padding: "12px 22px",
                fontWeight: 700,
                cursor: "pointer",
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              View all leads <FiArrowRight />
            </button>
          </div>

          {loading ? (
            <p style={{ color: "#64748B" }}>Loading scoring...</p>
          ) : (
            <>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "20px", marginBottom: "20px" }}>
                <div style={card}>
                  <div style={{ color: "#2563eb", marginBottom: "8px" }}><FiTarget size={18} /></div>
                  <h2 style={{ margin: 0, fontSize: "26px" }}>{avgScore}</h2>
                  <p style={{ color: "#64748B", marginTop: "4px" }}>Avg. score</p>
                </div>
                <div style={card}>
                  <div style={{ color: "#ea580c", marginBottom: "8px" }}>🔥</div>
                  <h2 style={{ margin: 0, fontSize: "26px" }}>{hotCount}</h2>
                  <p style={{ color: "#64748B", marginTop: "4px" }}>Hot (80+)</p>
                </div>
                <div style={card}>
                  <div style={{ color: "#7c3aed", marginBottom: "8px" }}><FiUsers size={18} /></div>
                  <h2 style={{ margin: 0, fontSize: "26px" }}>{leads.length}</h2>
                  <p style={{ color: "#64748B", marginTop: "4px" }}>Leads scored</p>
                </div>
                <div style={card}>
                  <div style={{ color: "#16a34a", marginBottom: "8px" }}><FiTrendingUp size={18} /></div>
                  <h2 style={{ margin: 0, fontSize: "26px" }}>{conversionRate}%</h2>
                  <p style={{ color: "#64748B", marginTop: "4px" }}>Conversion rate</p>
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "20px", marginBottom: "20px" }}>
                {BUCKETS.map((bucket) => {
                  const count = leads.filter((l) => bucket.test(l.score)).length;
                  return (
                    <div
                      key={bucket.key}
                      style={{
                        background: bucket.gradient,
                        borderRadius: "22px",
                        padding: "26px",
                        color: "#fff",
                      }}
                    >
                      <div style={{ fontSize: "20px", fontWeight: 700, marginBottom: "2px" }}>
                        {bucket.emoji} {bucket.label}
                      </div>
                      <p style={{ opacity: 0.85, margin: "0 0 14px" }}>{bucket.range}</p>
                      <h2 style={{ fontSize: "36px", margin: 0 }}>{count}</h2>
                      <p style={{ opacity: 0.85, margin: "0 0 16px" }}>leads</p>
                      <div
                        style={{
                          background: "rgba(255,255,255,.2)",
                          borderRadius: "10px",
                          padding: "10px 12px",
                          fontSize: "13px",
                        }}
                      >
                        {bucket.recommendation}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "20px" }}>
                <div style={card}>
                  <h2 style={{ margin: 0, color: "#172554" }}>Scoring guide</h2>
                  <p style={{ color: "#64748B", marginTop: "4px", marginBottom: "16px" }}>
                    Reference signals to weigh when setting a lead's score
                  </p>

                  {SCORING_GUIDE.map((row) => (
                    <div
                      key={row.signal}
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        padding: "10px 0",
                        borderTop: "1px solid #F1F5F9",
                      }}
                    >
                      <span>{row.signal}</span>
                      <strong style={{ color: row.points.startsWith("+") ? "#16a34a" : "#dc2626" }}>
                        {row.points}
                      </strong>
                    </div>
                  ))}
                </div>

                <div style={card}>
                  <h2 style={{ margin: 0, color: "#172554" }}>Top scored leads</h2>
                  <p style={{ color: "#64748B", marginTop: "4px", marginBottom: "16px" }}>
                    Ranked by intent right now
                  </p>

                  {topLeads.length === 0 ? (
                    <p style={{ color: "#94a3b8" }}>No leads yet.</p>
                  ) : (
                    topLeads.map((lead) => (
                      <div
                        key={lead.id}
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          padding: "10px 0",
                          borderTop: "1px solid #F1F5F9",
                        }}
                      >
                        <div>
                          <strong>{lead.name}</strong>
                          <p style={{ margin: "2px 0 0", color: "#64748B", fontSize: "13px" }}>
                            {lead.course || "No course"} • {lead.source}
                          </p>
                        </div>
                        <span
                          style={{
                            background: "#fff1e9",
                            color: "#ea580c",
                            padding: "4px 12px",
                            borderRadius: "999px",
                            fontWeight: 700,
                            fontSize: "13px",
                          }}
                        >
                          🔥 {lead.score}
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </div>

              <LeadScoringTab scoring={scoring} />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
