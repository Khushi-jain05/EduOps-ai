import { useState } from "react";
import { FiChevronDown } from "react-icons/fi";

import Sidebar from "../../components/layout/Sidebar";
import Navbar from "../../components/layout/Navbar";

const FAQS = [
  {
    q: "How do I apply for admission?",
    a: "Choose a program under Courses & Fees, then use Apply Now to submit your application. You can track progress on your dashboard's admission journey.",
  },
  {
    q: "What are the eligibility requirements?",
    a: "Eligibility varies by program. Undergraduate programs require a completed 10+2; postgraduate programs require a relevant bachelor's degree. See each program's details under Courses & Fees.",
  },
  {
    q: "Are scholarships available?",
    a: "Yes. Merit and need-based scholarships are available for most programs. Mention your interest during your counseling call.",
  },
  {
    q: "How do I book a counseling session?",
    a: "Use Book Appointment to schedule a 15 or 30 minute video call or campus visit. A counselor typically responds within 10 minutes during working hours.",
  },
  {
    q: "When is the application deadline?",
    a: "Applications for the 2026 intake are currently open. Deadlines differ per program — check the program details or ask Admissions AI.",
  },
];

export default function Faqs() {
  const [open, setOpen] = useState(0);

  return (
    <div style={{ display: "flex", height: "100vh", background: "#EEF6FF" }}>
      <Sidebar />
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        <Navbar />
        <div style={{ flex: 1, overflowY: "auto", padding: "35px" }}>
          <h1 style={{ margin: 0, color: "#111827" }}>Admission FAQs</h1>
          <p style={{ color: "#64748B", marginTop: "6px" }}>
            Answers to the most common admission questions.
          </p>

          <div style={{ maxWidth: "800px", marginTop: "28px", display: "flex", flexDirection: "column", gap: "14px" }}>
            {FAQS.map((item, i) => (
              <div
                key={i}
                style={{
                  background: "#fff",
                  borderRadius: "18px",
                  padding: "20px 24px",
                  boxShadow: "0 8px 20px rgba(15,23,42,.04)",
                }}
              >
                <div
                  onClick={() => setOpen(open === i ? -1 : i)}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    cursor: "pointer",
                    fontWeight: 600,
                    color: "#111827",
                    fontSize: "17px",
                  }}
                >
                  {item.q}
                  <FiChevronDown
                    style={{
                      transform: open === i ? "rotate(180deg)" : "none",
                      transition: ".2s",
                    }}
                  />
                </div>
                {open === i && (
                  <p style={{ color: "#475569", marginTop: "14px", lineHeight: 1.6 }}>{item.a}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
