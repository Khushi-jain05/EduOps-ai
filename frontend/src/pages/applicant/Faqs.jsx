import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiSearch, FiChevronDown, FiHelpCircle, FiBook, FiMessageSquare } from "react-icons/fi";
import { PiSparkleFill } from "react-icons/pi";

import { ApplicantPage, ApplicantHero, StatRow } from "../../components/applicant/ApplicantShell";
import { heroWhiteBtn } from "../../components/applicant/styles";

const CATEGORIES = ["All", "Admissions", "Fees & Scholarships", "Documents", "Hostel & Campus", "Placements", "International"];

const FAQS = [
  { cat: "Admissions", q: "What are the eligibility criteria for B.Tech CSE?", a: "10+2 with PCM and minimum 60% aggregate. JEE Main score or our entrance test (EduOps Aptitude) is mandatory. Reserved category relaxations apply per government norms." },
  { cat: "Admissions", q: "When does the 2026 intake admission start?", a: "Applications for the 2026 intake are open now. Early applications close in March 2026; final rounds run through June 2026 subject to seat availability." },
  { cat: "Admissions", q: "Is there an entrance test? Can I skip it?", a: "Most engineering programs accept JEE Main. If you don't have a JEE score, you can take the EduOps Aptitude Test. Management programs accept CAT/MAT scores." },
  { cat: "Fees & Scholarships", q: "What is the fee structure for B.Tech?", a: "B.Tech fees range from ₹1.5L to ₹1.8L per year depending on the branch. This covers tuition; hostel and mess are billed separately." },
  { cat: "Fees & Scholarships", q: "What scholarships are available?", a: "Merit scholarships (up to 100% tuition) for top rankers, need-based aid, and category scholarships. Sports and cultural scholarships are also offered." },
  { cat: "Fees & Scholarships", q: "Do you offer EMI or education loans?", a: "Yes. We partner with major banks and NBFCs for education loans, and offer a no-cost EMI plan for tuition across the academic year." },
  { cat: "Documents", q: "Which documents do I need to upload?", a: "10th & 12th marksheets, a photo ID, passport-size photo, and your entrance score card. Category/income certificates if applicable." },
  { cat: "Documents", q: "Are originals required at the time of admission?", a: "Yes, original documents are verified at the time of final admission and returned after verification. Keep attested copies ready too." },
  { cat: "Hostel & Campus", q: "Is hostel accommodation guaranteed for first-year students?", a: "Yes, first-year students are guaranteed on-campus hostel accommodation. Rooms are allotted on a first-come basis by application date." },
  { cat: "Hostel & Campus", q: "What facilities are available on campus?", a: "Wi-Fi campus, libraries, labs, sports complex, gym, medical center, cafeterias, and 24/7 security with hostel wardens." },
  { cat: "Placements", q: "What is the average placement package?", a: "The average package for the last batch was ₹7.2 LPA with a highest of ₹41 LPA. CSE and Data Science lead placements." },
  { cat: "Placements", q: "Which companies recruit on campus?", a: "Recruiters include leading IT services, product companies, banks, and startups across engineering and management roles." },
  { cat: "International", q: "Do you have semester-exchange programs?", a: "Yes, we have exchange tie-ups with partner universities in Europe and Asia for a semester abroad, plus credit-transfer options." },
];

const CAT_STYLE = {
  color: "#64748B",
  background: "#F1F5F9",
  padding: "4px 12px",
  borderRadius: "999px",
  fontSize: "11px",
  fontWeight: 700,
  letterSpacing: "0.5px",
  textTransform: "uppercase",
};

export default function Faqs() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [cat, setCat] = useState("All");
  const [open, setOpen] = useState(0);

  const filtered = useMemo(() => {
    return FAQS.filter((f) => {
      const matchesCat = cat === "All" || f.cat === cat;
      const matchesSearch =
        f.q.toLowerCase().includes(search.toLowerCase()) ||
        f.a.toLowerCase().includes(search.toLowerCase());
      return matchesCat && matchesSearch;
    });
  }, [search, cat]);

  const categoryCount = new Set(FAQS.map((f) => f.cat)).size;

  return (
    <ApplicantPage>
      <ApplicantHero
        tag="Applicant • FAQs"
        title="Admission FAQs"
        subtitle="Answers to the most common questions from applicants — eligibility, fees, documents, hostel and placements."
      >
        <div style={{ display: "flex", gap: "14px", alignItems: "center" }}>
          <div style={{ flex: 1, background: "#fff", borderRadius: "16px", height: "54px", display: "flex", alignItems: "center", padding: "0 20px", maxWidth: "720px" }}>
            <FiSearch color="#94A3B8" size={20} />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search FAQs (e.g. hostel, fees, JEE)"
              style={{ border: "none", outline: "none", flex: 1, marginLeft: "12px", fontSize: "16px" }}
            />
          </div>
          <button style={heroWhiteBtn} onClick={() => navigate("/applicant/admissions-ai")}>
            <PiSparkleFill /> Ask AI
          </button>
        </div>
      </ApplicantHero>

      <StatRow
        items={[
          { icon: <FiHelpCircle />, value: FAQS.length, label: "Total questions" },
          { icon: <FiBook />, value: categoryCount, label: "Categories" },
          { icon: <FiMessageSquare />, value: "24/7", label: "Answered by AI" },
        ]}
      />

      <div style={{ background: "#fff", borderRadius: "24px", padding: "30px", marginTop: "24px" }}>
        <h2 style={{ margin: 0, color: "#111827" }}>Browse questions</h2>
        <p style={{ margin: "6px 0 18px", color: "#64748B" }}>{filtered.length} matching</p>

        <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", marginBottom: "20px" }}>
          {CATEGORIES.map((c) => (
            <button
              key={c}
              onClick={() => setCat(c)}
              style={{
                border: "1px solid #E2E8F0",
                background: cat === c ? "#2563EB" : "#fff",
                color: cat === c ? "#fff" : "#334155",
                borderRadius: "999px",
                padding: "8px 18px",
                cursor: "pointer",
                fontWeight: 600,
                fontSize: "13px",
              }}
            >
              {c}
            </button>
          ))}
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {filtered.map((item, i) => (
            <div key={item.q} style={{ border: "1px solid #EEF2F7", borderRadius: "16px", padding: "18px 22px" }}>
              <div
                onClick={() => setOpen(open === i ? -1 : i)}
                style={{ display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer" }}
              >
                <span style={{ fontWeight: 600, color: "#111827", fontSize: "16px" }}>{item.q}</span>
                <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                  <span style={CAT_STYLE}>{item.cat}</span>
                  <FiChevronDown style={{ transform: open === i ? "rotate(180deg)" : "none", transition: ".2s", color: "#94A3B8" }} />
                </div>
              </div>
              {open === i && <p style={{ color: "#475569", marginTop: "14px", lineHeight: 1.6 }}>{item.a}</p>}
            </div>
          ))}
          {filtered.length === 0 && (
            <p style={{ color: "#64748B", textAlign: "center", padding: "30px" }}>No questions match your search.</p>
          )}
        </div>
      </div>
    </ApplicantPage>
  );
}
