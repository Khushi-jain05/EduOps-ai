import { FiSearch, FiFilter } from "react-icons/fi";

export default function QuestionPaperSearch() {
  return (
    <div
      style={{
        marginTop: "25px",
        marginBottom: "30px",
        background: "#fff",
        borderRadius: "22px",
        padding: "18px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        boxShadow: "0 8px 25px rgba(15,23,42,.05)",
      }}
    >
      {/* Search */}

      <div
        style={{
          width: "350px",
          display: "flex",
          alignItems: "center",
          gap: "10px",
          background: "#F8FAFC",
          border: "1px solid #E5E7EB",
          borderRadius: "14px",
          padding: "12px 18px",
        }}
      >
        <FiSearch color="#64748B" size={18} />

        <input
          type="text"
          placeholder="Search papers..."
          style={{
            border: "none",
            outline: "none",
            background: "transparent",
            width: "100%",
            fontSize: "15px",
          }}
        />
      </div>

      {/* Filters */}

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "18px",
          color: "#64748B",
          fontSize: "15px",
        }}
      >
        <FiFilter />

        <span
          style={{
            cursor: "pointer",
          }}
        >
          All Subjects
        </span>

        <span>•</span>

        <span
          style={{
            cursor: "pointer",
          }}
        >
          All Types
        </span>

        <span>•</span>

        <span
          style={{
            cursor: "pointer",
          }}
        >
          Last 30 Days
        </span>
      </div>
    </div>
  );
}