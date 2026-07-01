import {
  FiArrowRight,
  FiBookOpen,
  FiShare2,
  FiDownload,
  FiTrendingUp,
} from "react-icons/fi";

import { useNavigate } from "react-router-dom";

export default function McqCard({ mcq }) {
  const navigate = useNavigate();

  const difficultyColor = {
    Easy: "#22C55E",
    Medium: "#F59E0B",
    Hard: "#EF4444",
  };

  const progress =
    Math.min(
      100,
      ((mcq.question_count || 0) / 30) * 100
    ) || 0;

  return (
    <div
      style={{
        background: "#fff",
        borderRadius: "26px",
        padding: "26px",
        border: "1px solid #E2E8F0",
        boxShadow:
          "0 10px 30px rgba(15,23,42,.05)",
        transition: ".25s",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        minHeight: "340px",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform =
          "translateY(-6px)";
        e.currentTarget.style.boxShadow =
          "0 18px 45px rgba(99,102,241,.18)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform =
          "translateY(0)";
        e.currentTarget.style.boxShadow =
          "0 10px 30px rgba(15,23,42,.05)";
      }}
    >
      {/* Top */}

      <div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "20px",
          }}
        >
          <div>

            <small
              style={{
                color: "#2563eb",
                fontWeight: 700,
                letterSpacing: ".5px",
              }}
            >
              {mcq.Subject?.code}
            </small>

            <div
              style={{
                color: "#64748B",
                fontSize: "13px",
              }}
            >
              {mcq.Subject?.name}
            </div>

          </div>

          <span
            style={{
              background:
                difficultyColor[mcq.difficulty] +
                "20",
              color:
                difficultyColor[mcq.difficulty],
              padding: "7px 14px",
              borderRadius: "20px",
              fontSize: "13px",
              fontWeight: 600,
            }}
          >
            {mcq.difficulty}
          </span>

        </div>

        <h2
          style={{
            margin: 0,
            color: "#0F172A",
            fontSize: "24px",
          }}
        >
          {mcq.title}
        </h2>

        <div
          style={{
            marginTop: "26px",
            display: "flex",
            justifyContent:
              "space-between",
            alignItems: "center",
          }}
        >
          <div>

            <div
              style={{
                fontSize: "48px",
                fontWeight: 700,
                color: "#0F172A",
              }}
            >
              {mcq.question_count}
            </div>

            <div
              style={{
                color: "#64748B",
              }}
            >
              Questions Generated
            </div>

          </div>

          <div
            style={{
              width: "80px",
              height: "80px",
              borderRadius: "22px",
              background:
                "linear-gradient(135deg,#EEF2FF,#C7D2FE)",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              color: "#2563eb",
              fontSize: "34px",
            }}
          >
            <FiBookOpen />
          </div>

        </div>

      </div>

      {/* Progress */}

      <div
        style={{
          marginTop: "26px",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent:
              "space-between",
            marginBottom: "8px",
            color: "#64748B",
            fontSize: "14px",
          }}
        >
          <span>Coverage</span>

          <span>{Math.round(progress)}%</span>
        </div>

        <div
          style={{
            height: "8px",
            background: "#E2E8F0",
            borderRadius: "20px",
          }}
        >
          <div
            style={{
              width: `${progress}%`,
              height: "100%",
              borderRadius: "20px",
              background:
                "linear-gradient(135deg,#2563eb,#60a5fa)",
            }}
          />
        </div>

      </div>

      {/* Bottom */}

      <div
        style={{
          display: "flex",
          justifyContent:
            "space-between",
          alignItems: "center",
          marginTop: "28px",
        }}
      >
        <div>

          <div
            style={{
              color: "#64748B",
              fontSize: "13px",
            }}
          >
            Status
          </div>

          <div
            style={{
              fontWeight: 600,
              color:
                mcq.status === "published"
                  ? "#16A34A"
                  : "#F59E0B",
            }}
          >
            {mcq.status}
          </div>

        </div>

        <button
          onClick={() =>
            navigate(`/faculty/mcq/${mcq.id}`)
          }
          style={{
            background:
              "linear-gradient(135deg,#2563eb,#60a5fa)",
            color: "#fff",
            border: "none",
            padding: "12px 22px",
            borderRadius: "16px",
            display: "flex",
            alignItems: "center",
            gap: "8px",
            cursor: "pointer",
            fontWeight: 600,
          }}
        >
          Open Editor

          <FiArrowRight />
        </button>

      </div>
    </div>
  );
}