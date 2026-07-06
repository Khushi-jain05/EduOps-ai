import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiSearch, FiClock, FiUsers } from "react-icons/fi";
import { PiSparkleFill, PiGraduationCapBold, PiStackBold, PiTrophyBold } from "react-icons/pi";

import { ApplicantPage, ApplicantHero, StatRow } from "../../components/applicant/ApplicantShell";
import { heroWhiteBtn } from "../../components/applicant/styles";
import { getPrograms } from "../../services/applicant.service";

const CARD_COLORS = ["#2563EB", "#06B6D4", "#7C3AED", "#3B82F6", "#2563EB", "#0EA5E9", "#7C3AED", "#06B6D4"];

export default function CoursesFees() {
  const navigate = useNavigate();
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [level, setLevel] = useState("All");

  useEffect(() => {
    getPrograms()
      .then(setPrograms)
      .catch((err) => console.error("Failed to load programs", err))
      .finally(() => setLoading(false));
  }, []);

  const ugCount = programs.filter((p) => p.level === "UG").length;
  const pgCount = programs.filter((p) => p.level === "PG").length;

  const filtered = useMemo(() => {
    return programs.filter((p) => {
      const matchesLevel = level === "All" || p.level === level;
      const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase());
      return matchesLevel && matchesSearch;
    });
  }, [programs, level, search]);

  return (
    <ApplicantPage>
      <ApplicantHero
        tag="Applicant • Courses & Fees"
        title="Courses & Fees"
        subtitle="Explore every program offered for the 2026 intake — duration, fees, seats and eligibility all in one place."
      >
        <div style={{ display: "flex", gap: "14px", alignItems: "center" }}>
          <div style={{ flex: 1, background: "#fff", borderRadius: "16px", height: "54px", display: "flex", alignItems: "center", padding: "0 20px", maxWidth: "720px" }}>
            <FiSearch color="#94A3B8" size={20} />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search Programs..."
              style={{ border: "none", outline: "none", flex: 1, marginLeft: "12px", fontSize: "16px" }}
            />
          </div>
          <button style={heroWhiteBtn} onClick={() => navigate("/applicant/admissions-ai")}>
            <PiSparkleFill /> Help me choose
          </button>
        </div>
      </ApplicantHero>

      <StatRow
        items={[
          { icon: <PiGraduationCapBold />, value: programs.length, label: "Programs" },
          { icon: <PiStackBold />, value: ugCount, label: "Undergraduate" },
          { icon: <PiTrophyBold />, value: pgCount, label: "Postgraduate" },
        ]}
      />

      <div style={{ background: "#fff", borderRadius: "24px", padding: "30px", marginTop: "24px" }}>
        <h2 style={{ margin: 0, color: "#111827" }}>All programs</h2>
        <p style={{ margin: "6px 0 18px", color: "#64748B" }}>{filtered.length} of {programs.length} programs</p>

        <div style={{ display: "flex", gap: "12px", alignItems: "center", marginBottom: "22px" }}>
          <div style={{ flex: 1, background: "#F8FAFC", borderRadius: "14px", height: "48px", display: "flex", alignItems: "center", padding: "0 16px", border: "1px solid #EEF2F7" }}>
            <FiSearch color="#94A3B8" />
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search programs" style={{ border: "none", outline: "none", background: "transparent", flex: 1, marginLeft: "10px" }} />
          </div>
          {["All", "UG", "PG"].map((l) => (
            <button key={l} onClick={() => setLevel(l)} style={{ border: "1px solid #E2E8F0", background: level === l ? "#2563EB" : "#fff", color: level === l ? "#fff" : "#334155", borderRadius: "999px", padding: "10px 20px", cursor: "pointer", fontWeight: 600 }}>
              {l}
            </button>
          ))}
        </div>

        {loading ? (
          <h3>Loading programs...</h3>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(340px,1fr))", gap: "22px" }}>
            {filtered.map((p, i) => (
              <div key={p.id} style={{ border: "1px solid #EEF2F7", borderRadius: "22px", padding: "24px", boxShadow: "0 8px 20px rgba(15,23,42,.04)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <div style={{ width: "52px", height: "52px", borderRadius: "16px", background: CARD_COLORS[i % CARD_COLORS.length], color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "22px" }}>
                    <PiGraduationCapBold />
                  </div>
                  <span style={{ color: "#64748B", background: "#F1F5F9", padding: "4px 12px", borderRadius: "999px", fontSize: "11px", fontWeight: 700 }}>{p.level}</span>
                </div>

                <h3 style={{ margin: "18px 0 4px", color: "#111827", fontSize: "20px" }}>{p.name}</h3>
                <p style={{ color: "#64748B", fontSize: "14px", margin: 0 }}>{p.eligibility || p.description}</p>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "10px", marginTop: "18px" }}>
                  <Fact icon={<FiClock />} label="Duration" value={p.duration.replace(" years", " yrs").replace(" year", " yr")} />
                  <Fact icon="₹" label="Fee/yr" value={p.fee.replace("/yr", "")} />
                  <Fact icon={<FiUsers />} label="Seats" value={p.seats} />
                </div>

                <button onClick={() => navigate("/applicant/apply")} style={{ marginTop: "18px", border: "none", background: "transparent", color: "#2563EB", fontWeight: 600, cursor: "pointer", padding: 0 }}>
                  View details →
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </ApplicantPage>
  );
}

function Fact({ icon, label, value }) {
  return (
    <div style={{ background: "#F8FAFC", borderRadius: "12px", padding: "12px" }}>
      <div style={{ color: "#94A3B8", fontSize: "11px", display: "flex", alignItems: "center", gap: "5px" }}>
        <span>{icon}</span> {label}
      </div>
      <div style={{ fontWeight: 700, color: "#111827", marginTop: "4px", fontSize: "14px" }}>{value}</div>
    </div>
  );
}
