import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiSearch, FiCornerDownLeft } from "react-icons/fi";
import { PanelLeft } from "lucide-react";
import NotificationDropdown from "../notifications/NotificationDropdown";
import { getLeads } from "../../services/leads.service";

// Quick-nav destinations per role — powers the global search on every page.
const DESTINATIONS = {
  student: [
    { label: "Dashboard", path: "/student" },
    { label: "Support AI", path: "/support-ai" },
    { label: "Timetable", path: "/timetable" },
    { label: "Assignments", path: "/assignments" },
    { label: "Exams", path: "/exams" },
    { label: "Subject Assistant", path: "/subject-assistant" },
    { label: "Notifications", path: "/notifications" },
    { label: "Profile", path: "/profile" },
  ],
  faculty: [
    { label: "Dashboard", path: "/faculty" },
    { label: "Question Paper", path: "/faculty/question-paper" },
    { label: "MCQ Generator", path: "/faculty/mcq" },
    { label: "Lesson Plans", path: "/faculty/lesson-plan" },
    { label: "Assignments", path: "/faculty/assignments" },
    { label: "Analytics", path: "/faculty/analytics" },
    { label: "Notifications", path: "/faculty/notifications" },
    { label: "Profile", path: "/faculty/profile" },
  ],
  applicant: [
    { label: "Dashboard", path: "/applicant" },
    { label: "Admissions AI", path: "/applicant/admissions-ai" },
    { label: "FAQs", path: "/applicant/faqs" },
    { label: "Courses & Fees", path: "/applicant/courses" },
    { label: "Apply Now", path: "/applicant/apply" },
    { label: "Book Appointment", path: "/applicant/appointment" },
    { label: "Profile", path: "/applicant/profile" },
  ],
  admin: [
    { label: "Dashboard", path: "/admin" },
    { label: "AI Admission Assist", path: "/admin/ai-admission-assist" },
    { label: "Lead Intent Scoring", path: "/admin/lead-scoring" },
    { label: "Smart Follow-ups", path: "/admin/follow-ups" },
    { label: "AI Calling", path: "/admin/ai-calling" },
    { label: "Counselor Performance", path: "/admin/counselor-performance" },
    { label: "All Leads", path: "/admin/leads" },
    { label: "Notifications", path: "/notifications" },
    { label: "Profile", path: "/profile" },
  ],
};

export default function Navbar() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const role = user.role || "student";

  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [leadResults, setLeadResults] = useState([]);
  const wrapRef = useRef(null);

  const destinations = DESTINATIONS[role] || DESTINATIONS.student;

  const pageMatches = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return destinations;
    return destinations.filter((d) => d.label.toLowerCase().includes(q));
  }, [query, destinations]);

  // Admin-only: live search of real leads by name/phone/email/course/city.
  useEffect(() => {
    if (role !== "admin") return undefined;
    const q = query.trim();
    if (q.length < 2) {
      setLeadResults([]);
      return undefined;
    }
    const t = setTimeout(async () => {
      try {
        const leads = await getLeads({ q });
        setLeadResults(leads.slice(0, 5));
      } catch {
        setLeadResults([]);
      }
    }, 300);
    return () => clearTimeout(t);
  }, [query, role]);

  // Close the dropdown when clicking outside.
  useEffect(() => {
    const onDown = (e) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, []);

  const go = (path) => {
    setOpen(false);
    setQuery("");
    setLeadResults([]);
    navigate(path);
  };

  const onKeyDown = (e) => {
    if (e.key === "Enter") {
      if (pageMatches.length > 0) go(pageMatches[0].path);
      else if (leadResults.length > 0) go(`/admin/leads?q=${encodeURIComponent(query.trim())}`);
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  };

  const hasResults = pageMatches.length > 0 || leadResults.length > 0;

  return (
    <div
      style={{
        height: "80px",
        background: "#fff",
        borderBottom: "1px solid #e5e7eb",
        display: "flex",
        alignItems: "center",
        gap: "16px",
        padding: "0 30px",
      }}
    >
      <button
        type="button"
        title="Toggle sidebar"
        style={{
          width: "38px",
          height: "38px",
          flexShrink: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          border: "1px solid #e5e7eb",
          borderRadius: "10px",
          background: "#fff",
          color: "#64748b",
          cursor: "pointer",
        }}
      >
        <PanelLeft size={18} />
      </button>

      <div ref={wrapRef} style={{ position: "relative", flex: 1, maxWidth: "560px" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            background: "#f3f4f6",
            padding: "12px 18px",
            borderRadius: "999px",
          }}
        >
          <FiSearch color="#94a3b8" />
          <input
            type="text"
            value={query}
            placeholder="Search across EduOps AI..."
            onFocus={() => setOpen(true)}
            onChange={(e) => {
              setQuery(e.target.value);
              setOpen(true);
            }}
            onKeyDown={onKeyDown}
            style={{
              border: "none",
              background: "transparent",
              width: "100%",
              outline: "none",
            }}
          />
          {query && (
            <span style={{ color: "#cbd5e1", fontSize: "12px", display: "flex", alignItems: "center", gap: "4px" }}>
              <FiCornerDownLeft /> enter
            </span>
          )}
        </div>

        {open && (
          <div
            style={{
              position: "absolute",
              top: "56px",
              left: 0,
              right: 0,
              background: "#fff",
              borderRadius: "16px",
              boxShadow: "0 20px 50px rgba(15,23,42,.18)",
              border: "1px solid #eef2f7",
              padding: "8px",
              zIndex: 50,
              maxHeight: "420px",
              overflowY: "auto",
            }}
          >
            {!hasResults && (
              <p style={{ color: "#94a3b8", padding: "12px 14px", margin: 0 }}>
                No matches for "{query}".
              </p>
            )}

            {pageMatches.length > 0 && (
              <>
                <p style={{ color: "#94a3b8", fontSize: "11px", letterSpacing: "1px", padding: "8px 14px 4px", margin: 0 }}>
                  PAGES
                </p>
                {pageMatches.map((d) => (
                  <div
                    key={d.path}
                    onClick={() => go(d.path)}
                    style={{ padding: "10px 14px", borderRadius: "10px", cursor: "pointer", color: "#334155" }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = "#f1f5f9")}
                    onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                  >
                    {d.label}
                  </div>
                ))}
              </>
            )}

            {leadResults.length > 0 && (
              <>
                <p style={{ color: "#94a3b8", fontSize: "11px", letterSpacing: "1px", padding: "10px 14px 4px", margin: 0 }}>
                  LEADS
                </p>
                {leadResults.map((lead) => (
                  <div
                    key={lead.id}
                    onClick={() => go(`/admin/leads?q=${encodeURIComponent(lead.name)}`)}
                    style={{ padding: "10px 14px", borderRadius: "10px", cursor: "pointer" }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = "#f1f5f9")}
                    onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                  >
                    <strong style={{ color: "#172554" }}>{lead.name}</strong>
                    <span style={{ color: "#94a3b8", fontSize: "13px" }}>
                      {"  "}
                      {lead.course || "No course"} • {lead.phone}
                    </span>
                  </div>
                ))}
              </>
            )}
          </div>
        )}
      </div>

      <div style={{ marginLeft: "auto" }}>
        <NotificationDropdown />
      </div>
    </div>
  );
}
