import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiCheckCircle,
  FiClock,
  FiDollarSign,
  FiArrowRight,
  FiMessageSquare,
  FiCalendar,
  FiPhone,
  FiHelpCircle,
  FiBook,
  FiFilePlus,
} from "react-icons/fi";
import { PiRobotBold, PiGraduationCapBold } from "react-icons/pi";

import Sidebar from "../../components/layout/Sidebar";
import Navbar from "../../components/layout/Navbar";

import {
  getApplicantDashboard,
  advanceApplication,
  getAppointments,
} from "../../services/applicant.service";

function getUserName() {
  try {
    return JSON.parse(localStorage.getItem("user"))?.username || "Applicant";
  } catch {
    return "Applicant";
  }
}

export default function ApplicantDashboard() {
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [advancing, setAdvancing] = useState(false);
  const [nextMeeting, setNextMeeting] = useState(null);

  const load = async () => {
    try {
      const res = await getApplicantDashboard();
      setData(res);
      try {
        const appts = await getAppointments();
        const upcoming = appts
          .filter((a) => new Date(a.slot).getTime() >= Date.now() && a.status !== "cancelled")
          .sort((a, b) => new Date(a.slot) - new Date(b.slot));
        setNextMeeting(upcoming[0] || null);
      } catch {
        /* appointments are optional on the dashboard */
      }
    } catch (err) {
      console.error("Failed to load applicant dashboard", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleContinue = async () => {
    setAdvancing(true);
    try {
      await advanceApplication();
      await load();
    } catch (err) {
      console.error("Failed to advance application", err);
    } finally {
      setAdvancing(false);
    }
  };

  const stats = data?.stats || {};
  const journey = data?.journey || [];
  const featured = data?.featuredPrograms || [];

  const statCards = [
    {
      label: "APPLICATION PROGRESS",
      value: `${stats.progressPercent ?? 0}%`,
      sub: `${stats.stepsDone ?? 0} of ${stats.totalSteps ?? 5} steps`,
      icon: <FiCheckCircle />,
      color: "#2563EB",
    },
    {
      label: "PROGRAMS OPEN",
      value: stats.programsOpen ?? 0,
      sub: "2026 intake",
      icon: <PiGraduationCapBold />,
      color: "#06B6D4",
    },
    {
      label: "AVG FEE/YEAR",
      value: stats.avgFee ?? "—",
      sub: "Scholarships available",
      icon: <FiDollarSign />,
      color: "#7C3AED",
    },
    {
      label: "COUNSELOR RESPONSE",
      value: "< 10m",
      sub: "Mon–Sat, 9–7",
      icon: <FiClock />,
      color: "#F97316",
    },
  ];

  return (
    <div style={{ display: "flex", height: "100vh", background: "#EEF6FF" }}>
      <Sidebar />

      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        <Navbar />

        <div style={{ flex: 1, overflowY: "auto", padding: "35px" }}>
          {/* Welcome */}
          <p
            style={{
              fontSize: "13px",
              color: "#6B7280",
              letterSpacing: "3px",
              textTransform: "uppercase",
              marginBottom: "8px",
              fontWeight: 500,
            }}
          >
            Applicant Workspace
          </p>
          <h1 style={{ fontSize: "44px", fontWeight: 700, margin: 0, color: "#111827" }}>
            Hello, <span style={{ color: "#3B82F6" }}>{getUserName()}</span>
          </h1>
          <p style={{ marginTop: "8px", fontSize: "18px", color: "#64748B" }}>
            Explore programs, get answers, and book your campus visit.
          </p>

          {loading ? (
            <h2 style={{ marginTop: "40px" }}>Loading dashboard...</h2>
          ) : (
            <>
              {nextMeeting && (
                <div
                  style={{
                    marginTop: "28px",
                    background: "linear-gradient(135deg,#2563EB,#4F8EF7)",
                    borderRadius: "22px",
                    padding: "24px 28px",
                    color: "#fff",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    gap: "16px",
                    flexWrap: "wrap",
                  }}
                >
                  <div>
                    <p style={{ margin: 0, opacity: 0.85, fontSize: "13px", letterSpacing: "1px" }}>
                      UPCOMING COUNSELING CALL
                    </p>
                    <h2 style={{ margin: "6px 0 0", fontSize: "22px" }}>
                      {new Date(nextMeeting.slot).toLocaleString(undefined, {
                        dateStyle: "medium",
                        timeStyle: "short",
                      })}
                    </h2>
                    <p style={{ margin: "4px 0 0", opacity: 0.9 }}>
                      {nextMeeting.mode} • {nextMeeting.program || "General counseling"} •{" "}
                      <span style={{ textTransform: "capitalize" }}>{nextMeeting.status}</span>
                    </p>
                  </div>
                  {nextMeeting.meeting_link && (
                    <a
                      href={nextMeeting.meeting_link}
                      target="_blank"
                      rel="noreferrer"
                      style={{
                        background: "#fff",
                        color: "#2563EB",
                        borderRadius: "14px",
                        padding: "14px 24px",
                        fontWeight: 700,
                        textDecoration: "none",
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "8px",
                        whiteSpace: "nowrap",
                      }}
                    >
                      <FiPhone /> Join meeting
                    </a>
                  )}
                </div>
              )}

              {/* Stat cards */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(4,1fr)",
                  gap: "22px",
                  marginTop: "28px",
                }}
              >
                {statCards.map((s) => (
                  <div
                    key={s.label}
                    style={{
                      background: "#fff",
                      borderRadius: "22px",
                      padding: "24px",
                      boxShadow: "0 10px 30px rgba(15,23,42,.05)",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                      }}
                    >
                      <span style={{ fontSize: "12px", letterSpacing: "1px", color: "#64748B", fontWeight: 600 }}>
                        {s.label}
                      </span>
                      <div
                        style={{
                          width: "40px",
                          height: "40px",
                          borderRadius: "12px",
                          background: s.color,
                          color: "#fff",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: "18px",
                        }}
                      >
                        {s.icon}
                      </div>
                    </div>
                    <div style={{ fontSize: "34px", fontWeight: 700, color: "#111827", marginTop: "12px" }}>
                      {s.value}
                    </div>
                    <div style={{ color: "#94A3B8", fontSize: "14px", marginTop: "4px" }}>{s.sub}</div>
                  </div>
                ))}
              </div>

              {/* Journey + Talk to admissions */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1.6fr 1fr",
                  gap: "24px",
                  marginTop: "28px",
                }}
              >
                <div style={{ background: "#fff", borderRadius: "24px", padding: "30px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div>
                      <h2 style={{ margin: 0, color: "#111827" }}>Your admission journey</h2>
                      <p style={{ margin: "6px 0 0", color: "#64748B" }}>Track every step to enrolment</p>
                    </div>
                    <button
                      onClick={handleContinue}
                      disabled={advancing || stats.stepsDone >= stats.totalSteps}
                      style={{
                        background: "#2563EB",
                        color: "#fff",
                        border: "none",
                        borderRadius: "14px",
                        padding: "12px 20px",
                        fontWeight: 600,
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        opacity: advancing || stats.stepsDone >= stats.totalSteps ? 0.6 : 1,
                      }}
                    >
                      {stats.stepsDone >= stats.totalSteps ? "Completed" : "Continue application"}
                      <FiArrowRight />
                    </button>
                  </div>

                  <div style={{ marginTop: "24px", display: "flex", flexDirection: "column", gap: "14px" }}>
                    {journey.map((step) => (
                      <div
                        key={step.step}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "16px",
                          border: "1px solid #EEF2F7",
                          borderRadius: "16px",
                          padding: "16px 18px",
                          background: step.current ? "#F5F9FF" : "#fff",
                        }}
                      >
                        <div
                          style={{
                            width: "30px",
                            height: "30px",
                            borderRadius: "50%",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            background: step.completed ? "#2563EB" : "#EEF2F7",
                            color: step.completed ? "#fff" : "#64748B",
                            fontSize: "14px",
                            fontWeight: 600,
                            flexShrink: 0,
                          }}
                        >
                          {step.completed ? <FiCheckCircle /> : step.step}
                        </div>
                        <span style={{ fontWeight: 600, color: "#111827" }}>{step.label}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Talk to admissions */}
                <div style={{ background: "#fff", borderRadius: "24px", padding: "30px" }}>
                  <h2 style={{ margin: 0, color: "#111827" }}>Talk to admissions</h2>
                  <p style={{ margin: "6px 0 20px", color: "#64748B" }}>We're here to help you decide</p>

                  <ActionRow
                    icon={<PiRobotBold />}
                    bg="#4F46E5"
                    title="Chat with Admissions AI"
                    sub="Instant answers · 24/7"
                    onClick={() => navigate("/applicant/admissions-ai")}
                  />
                  <ActionRow
                    icon={<FiCalendar />}
                    bg="#06B6D4"
                    title="Book a counseling slot"
                    sub="15 / 30 min · video or campus"
                    onClick={() => navigate("/applicant/appointment")}
                  />

                  <div style={{ display: "flex", gap: "12px", marginTop: "16px" }}>
                    <a
                      href="tel:+910000000000"
                      style={outlineBtn}
                    >
                      <FiPhone /> Call
                    </a>
                    <a
                      href="https://wa.me/910000000000"
                      target="_blank"
                      rel="noreferrer"
                      style={outlineBtn}
                    >
                      <FiMessageSquare /> WhatsApp
                    </a>
                  </div>
                </div>
              </div>

              {/* Quick links */}
              <div style={{ background: "#fff", borderRadius: "24px", padding: "30px", marginTop: "24px" }}>
                <h2 style={{ margin: 0, color: "#111827" }}>Quick links</h2>
                <p style={{ margin: "6px 0 20px", color: "#64748B" }}>Jump back into anything</p>

                <div style={{ display: "grid", gridTemplateColumns: "repeat(5,1fr)", gap: "16px" }}>
                  <QuickLink icon={<PiRobotBold />} bg="#4F46E5" title="Ask Admissions AI" sub="Get instant answers about admissions" onClick={() => navigate("/applicant/admissions-ai")} />
                  <QuickLink icon={<FiHelpCircle />} bg="#06B6D4" title="Admission FAQs" sub="Browse common questions" onClick={() => navigate("/applicant/faqs")} />
                  <QuickLink icon={<FiBook />} bg="#7C3AED" title="Courses & Fees" sub="Programs, eligibility & fees" onClick={() => navigate("/applicant/courses")} />
                  <QuickLink icon={<FiFilePlus />} bg="#2563EB" title="Apply Now" sub="Start your application" onClick={() => navigate("/applicant/apply")} />
                  <QuickLink icon={<FiCalendar />} bg="#0EA5E9" title="Book Appointment" sub="Campus visit or video call" onClick={() => navigate("/applicant/appointment")} />
                </div>
              </div>

              {/* Featured programs */}
              <div style={{ background: "#fff", borderRadius: "24px", padding: "30px", marginTop: "24px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <h2 style={{ margin: 0, color: "#111827" }}>Featured programs</h2>
                    <p style={{ margin: "6px 0 0", color: "#64748B" }}>Most-applied courses this intake</p>
                  </div>
                  <button onClick={() => navigate("/applicant/courses")} style={outlineBtn}>
                    View all
                  </button>
                </div>

                <table style={{ width: "100%", marginTop: "20px", borderCollapse: "collapse" }}>
                  <thead>
                    <tr style={{ textAlign: "left", color: "#94A3B8", fontSize: "13px" }}>
                      <th style={{ padding: "10px 0" }}>PROGRAM</th>
                      <th>DURATION</th>
                      <th>FEE</th>
                      <th>SEATS</th>
                      <th style={{ textAlign: "right" }}>ACTION</th>
                    </tr>
                  </thead>
                  <tbody>
                    {featured.map((p) => (
                      <tr key={p.id} style={{ borderTop: "1px solid #EEF2F7" }}>
                        <td style={{ padding: "18px 0", fontWeight: 600, color: "#111827" }}>{p.name}</td>
                        <td style={{ color: "#475569" }}>{p.duration}</td>
                        <td style={{ color: "#475569" }}>{p.fee}</td>
                        <td style={{ color: "#475569" }}>{p.seats}</td>
                        <td style={{ textAlign: "right" }}>
                          <button onClick={() => navigate("/applicant/courses")} style={outlineBtn}>
                            Details
                          </button>
                        </td>
                      </tr>
                    ))}
                    {featured.length === 0 && (
                      <tr>
                        <td colSpan={5} style={{ padding: "30px 0", textAlign: "center", color: "#94A3B8" }}>
                          No featured programs yet.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

const outlineBtn = {
  border: "1px solid #DDE5F0",
  background: "#fff",
  borderRadius: "12px",
  padding: "10px 18px",
  fontWeight: 600,
  color: "#334155",
  cursor: "pointer",
  display: "inline-flex",
  alignItems: "center",
  gap: "8px",
  textDecoration: "none",
};

function ActionRow({ icon, bg, title, sub, onClick }) {
  return (
    <div
      onClick={onClick}
      style={{
        display: "flex",
        alignItems: "center",
        gap: "14px",
        border: "1px solid #EEF2F7",
        borderRadius: "16px",
        padding: "16px",
        cursor: "pointer",
        marginBottom: "12px",
      }}
    >
      <div
        style={{
          width: "44px",
          height: "44px",
          borderRadius: "14px",
          background: bg,
          color: "#fff",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "20px",
        }}
      >
        {icon}
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ fontWeight: 600, color: "#111827" }}>{title}</div>
        <div style={{ color: "#64748B", fontSize: "13px" }}>{sub}</div>
      </div>
      <FiArrowRight color="#94A3B8" />
    </div>
  );
}

function QuickLink({ icon, bg, title, sub, onClick }) {
  return (
    <div
      onClick={onClick}
      style={{
        border: "1px solid #EEF2F7",
        borderRadius: "18px",
        padding: "22px",
        cursor: "pointer",
      }}
    >
      <div
        style={{
          width: "46px",
          height: "46px",
          borderRadius: "14px",
          background: bg,
          color: "#fff",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "20px",
          marginBottom: "16px",
        }}
      >
        {icon}
      </div>
      <div style={{ fontWeight: 700, color: "#111827" }}>{title}</div>
      <div style={{ color: "#64748B", fontSize: "13px", marginTop: "4px" }}>{sub}</div>
    </div>
  );
}
