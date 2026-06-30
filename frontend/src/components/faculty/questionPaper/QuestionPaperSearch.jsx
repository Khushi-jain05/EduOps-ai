import { FiSearch, FiFilter } from "react-icons/fi";

export default function QuestionPaperSearch({
  search,
  onSearchChange,
  subjectFilter,
  onSubjectFilterChange,
  typeFilter,
  onTypeFilterChange,
  dateFilter,
  onDateFilterChange,
  subjects = [],
  types = [],
}) {
  const selectStyle = {
    border: "none",
    outline: "none",
    background: "transparent",
    color: "#64748B",
    fontSize: "15px",
    cursor: "pointer",
  };

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
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
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

        <select
          value={subjectFilter}
          onChange={(e) => onSubjectFilterChange(e.target.value)}
          style={selectStyle}
        >
          <option value="all">All Subjects</option>
          {subjects.map((subject) => (
            <option key={subject.id} value={subject.id}>
              {subject.code || subject.name}
            </option>
          ))}
        </select>

        <span>•</span>

        <select
          value={typeFilter}
          onChange={(e) => onTypeFilterChange(e.target.value)}
          style={selectStyle}
        >
          <option value="all">All Types</option>
          {types.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>

        <span>•</span>

        <select
          value={dateFilter}
          onChange={(e) => onDateFilterChange(e.target.value)}
          style={selectStyle}
        >
          <option value="all">All Dates</option>
          <option value="7">Last 7 Days</option>
          <option value="30">Last 30 Days</option>
          <option value="90">Last 90 Days</option>
        </select>
      </div>
    </div>
  );
}
