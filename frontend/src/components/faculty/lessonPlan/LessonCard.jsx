import {
  FiArrowRight,
  FiCalendar,
  FiClock,
  FiBookOpen,
  FiTrash2,
} from "react-icons/fi";
import { useNavigate } from "react-router-dom";

export default function LessonCard({ plan, onDelete }) {
  const navigate = useNavigate();

  const badgeColor = {
    active: {
      bg: "#DCFCE7",
      color: "#15803D",
    },
    draft: {
      bg: "#FEF3C7",
      color: "#B45309",
    },
    scheduled: {
      bg: "#E0E7FF",
      color: "#3730A3",
    },
  };

  const status =
    badgeColor[plan.status] ||
    badgeColor.draft;

  return (
    <div
      style={{
        background: "#fff",
        borderRadius: "28px",
        padding: "26px",
        minHeight: "355px",

        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",

        border: "1px solid #E8EEF7",

        boxShadow:
          "0 12px 35px rgba(15,23,42,.06)",

        transition: ".25s",
      }}
    >
      {/* HEADER */}

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <div>
          <div
            style={{
              color: "#2563EB",
              fontWeight: 700,
              fontSize: "15px",
            }}
          >
            {plan.code}
          </div>

          <div
            style={{
              color: "#64748B",
              marginTop: "5px",
            }}
          >
            {plan.subject}
          </div>
        </div>

        <span
          style={{
            background: status.bg,
            color: status.color,
            padding: "8px 16px",
            borderRadius: "30px",
            fontSize: "13px",
            fontWeight: 600,
          }}
        >
          {plan.status}
        </span>
      </div>

      {/* TITLE */}

      <div>
        <h2
          style={{
            marginTop: "25px",
            marginBottom: "10px",
            fontSize: "28px",
            color: "#172554",
          }}
        >
          {plan.week}
        </h2>

        <p
          style={{
            color: "#334155",
            fontSize: "18px",
            margin: 0,
            lineHeight: "30px",
          }}
        >
          {plan.title}
        </p>

        {plan.topic && (
          <p
            style={{
              color: "#64748B",
              marginTop: "12px",
            }}
          >
            {plan.topic}
          </p>
        )}
      </div>

      {/* ICON */}

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginTop: "28px",
        }}
      >
        <div>
          <div
            style={{
              fontSize: "42px",
              fontWeight: 700,
              color: "#172554",
            }}
          >
            {plan.sessions}
          </div>

          <div
            style={{
              color: "#64748B",
            }}
          >
            Sessions
          </div>
        </div>

        <div
          style={{
            width: "82px",
            height: "82px",
            borderRadius: "22px",
            background:
              "linear-gradient(135deg,#EEF4FF,#DCEBFF)",

            display: "flex",
            justifyContent: "center",
            alignItems: "center",

            color: "#2563EB",

            fontSize: "38px",
          }}
        >
          <FiBookOpen />
        </div>
      </div>

      {/* INFO */}

      <div
        style={{
          marginTop: "25px",
        }}
      >
        <InfoRow
          icon={<FiCalendar />}
          text={plan.date || "Not Scheduled"}
        />

        <InfoRow
          icon={<FiClock />}
          text={plan.duration}
        />
      </div>

      {/* PROGRESS */}

      <div
        style={{
          marginTop: "22px",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: "8px",
            color: "#64748B",
            fontSize: "14px",
          }}
        >
          <span>Completion</span>

          <span>80%</span>
        </div>

        <div
          style={{
            height: "8px",
            background: "#E2E8F0",
            borderRadius: "20px",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              width: "80%",
              height: "100%",
              background:
                "linear-gradient(90deg,#2563EB,#60A5FA)",
            }}
          />
        </div>
      </div>

      {/* BUTTON */}

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 52px",
          gap: "10px",
          marginTop: "28px",
        }}
      >
        <button
          onClick={() =>
            navigate(`/faculty/lesson-plan/${plan.id}`)
          }
          style={{
            height: "52px",
            border: "none",
            borderRadius: "16px",
            background:
              "linear-gradient(90deg,#2563EB,#4F8EF7)",
            color: "#fff",
            fontSize: "16px",
            fontWeight: 600,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: "8px",
            cursor: "pointer",
          }}
        >
          Open Plan

          <FiArrowRight />
        </button>

        <button
          title="Delete lesson"
          onClick={() => onDelete?.(plan.id)}
          style={{
            height: "52px",
            border: "1px solid #FECACA",
            borderRadius: "16px",
            background: "#FEF2F2",
            color: "#DC2626",
            fontSize: "20px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            cursor: "pointer",
          }}
        >
          <FiTrash2 />
        </button>
      </div>
    </div>
  );
}

function InfoRow({
  icon,
  text,
}) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "10px",
        color: "#64748B",
        marginBottom: "10px",
      }}
    >
      {icon}

      {text}
    </div>
  );
}
