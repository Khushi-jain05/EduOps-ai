import {
  FiBarChart2,
  FiUsers,
  FiMessageCircle,
  FiPhoneCall,
  FiFileText,
  FiStar,
  FiSpeaker,
  FiActivity,
} from "react-icons/fi";

export const TABS = [
  { key: "overview", label: "Overview", icon: <FiBarChart2 /> },
  { key: "all-leads", label: "All Leads", icon: <FiUsers /> },
  { key: "whatsapp", label: "WhatsApp Automation", icon: <FiMessageCircle /> },
  // { key: "calling-agents", label: "AI Calling Agents", icon: <FiPhoneCall /> },
  { key: "google-sheets", label: "Google Sheets", icon: <FiFileText /> },
  { key: "scoring", label: "Lead Scoring", icon: <FiStar /> },
  { key: "campaigns", label: "Campaigns", icon: <FiSpeaker /> },
  { key: "activity", label: "Activity", icon: <FiActivity /> },
];

export default function LeadsTabs({ active, onChange }) {
  return (
    <div
      style={{
        background: "#fff",
        borderRadius: "20px",
        padding: "12px",
        display: "flex",
        flexWrap: "wrap",
        gap: "37px",
        marginBottom: "25px",
        boxShadow: "0 15px 40px rgba(37,99,235,.06)",
      }}
    >
      {TABS.map((tab) => (
        <button
          key={tab.key}
          onClick={() => onChange(tab.key)}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            padding: "10px 18px",
            borderRadius: "999px",
            border: active === tab.key ? "1px solid #2563eb" : "1px solid transparent",
            background: active === tab.key ? "#2563eb" : "transparent",
            color: active === tab.key ? "#fff" : "#374151",
            fontWeight: 600,
            fontSize: "14px",
            cursor: "pointer",
          }}
        >
          {tab.icon}
          {tab.label}
        </button>
      ))}
    </div>
  );
}
