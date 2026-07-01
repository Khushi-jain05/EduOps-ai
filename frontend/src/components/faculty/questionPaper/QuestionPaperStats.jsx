import {
  FiFileText,
  FiCheckCircle,
  FiClock,
  FiPlus,
  FiSearch,
} from "react-icons/fi";

export default function QuestionPaperStats({
  papers,
  search,
  onSearchChange,
  onNewPaper,
}) {
  const total = papers.length;

  const published = papers.filter(
    (paper) =>
      paper.status?.toLowerCase() === "published"
  ).length;

  const drafts = total - published;

  return (
    <>
      {/* HERO */}

      <div
        style={{
          background:
            "linear-gradient(135deg,#2563EB,#60A5FA)",
          borderRadius: "34px",
          padding: "38px",
          color: "#fff",
          marginBottom: "28px",
        }}
      >
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            background: "rgba(255,255,255,.18)",
            padding: "8px 18px",
            borderRadius: "30px",
            marginBottom: "20px",
            
          }}
        >
          Faculty • Question Papers
        </div>

        <h1
          style={{
            margin: 0,
            fontSize: "42px",
            fontWeight: 700,
          }}
        >
          Question Paper Generator
        </h1>

        <p
          style={{
            marginTop: "14px",
            fontSize: "17px",
            opacity: .95,
          }}
        >
          Generate AI-powered question papers
          from your question bank, uploaded
          PDFs and study material.
        </p>

        <div
          style={{
            display: "flex",
            gap: "18px",
            marginTop: "34px",
          }}
        >
          <div
            style={{
              flex: 1,
              position: "relative",
            }}
          >
            <FiSearch
              style={{
                position: "absolute",
                left: "18px",
                top: "18px",
                color: "#64748B",
              }}
            />

            <input
              placeholder="Search Question Papers..."
              value={search}
              onChange={(e) =>
                onSearchChange(e.target.value)
              }
              style={{
                width: "100%",
                height: "58px",
                borderRadius: "18px",
                border: "none",
                paddingLeft: "50px",
                fontSize: "17px",
                outline: "none",
              }}
            />
          </div>

          <button
            onClick={onNewPaper}
            style={{
              width: "220px",
              borderRadius: "18px",
              border: "none",
              background: "#fff",
              color: "#2563EB",
              fontWeight: 700,
              fontSize: "17px",
              cursor: "pointer",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: "10px",
            }}
          >
            <FiPlus />

            New Paper
          </button>
        </div>
      </div>

      {/* STATS */}

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit,minmax(270px,1fr))",
          gap: "20px",
          marginBottom: "30px",
        }}
      >
        <StatCard
          icon={<FiFileText />}
          title="Total Papers"
          value={total}
        />

        <StatCard
          icon={<FiCheckCircle />}
          title="Published"
          value={published}
        />

        <StatCard
          icon={<FiClock />}
          title="Drafts"
          value={drafts}
        />
      </div>
    </>
  );
}

function StatCard({
  icon,
  title,
  value,
}) {
  return (
    <div
      style={{
        background: "#fff",
        borderRadius: "26px",
        padding: "26px",
        display: "flex",
        alignItems: "center",
        gap: "20px",
        boxShadow:
          "0 8px 25px rgba(15,23,42,.05)",
      }}
    >
      <div
        style={{
          width: "60px",
          height: "60px",
          borderRadius: "18px",
          background: "#EEF4FF",
          color: "#2563EB",
          fontSize: "28px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {icon}
      </div>

      <div>
        <h2
          style={{
            margin: 0,
            fontSize: "34px",
          }}
        >
          {value}
        </h2>

        <p
          style={{
            margin: 0,
            marginTop: "5px",
            color: "#64748B",
            fontSize: "16px",
          }}
        >
          {title}
        </p>
      </div>
    </div>
  );
}