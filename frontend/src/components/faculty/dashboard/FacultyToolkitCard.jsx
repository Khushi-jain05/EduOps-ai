import { FiArrowRight } from "react-icons/fi";

export default function FacultyToolkitCard({
  icon,
  iconBg,
  title,
  description,
}) {
  return (
    <div
      style={{
        background: "#fff",
        border: "1px solid #EEF2F7",
        borderRadius: "22px",
        padding: "24px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        transition: ".25s",
        cursor: "pointer",
        boxShadow: "0 6px 18px rgba(0,0,0,.03)",
      }}
    >
      <div
        style={{
          display: "flex",
          gap: "18px",
          alignItems: "flex-start",
        }}
      >
        <div
          style={{
            width: "58px",
            height: "58px",
            borderRadius: "18px",
            background: iconBg,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            color: "#fff",
            fontSize: "24px",
          }}
        >
          {icon}
        </div>

        <div>
          <h3
            style={{
              margin: 0,
              fontSize: "22px",
              color: "#111827",
            }}
          >
            {title}
          </h3>

          <p
            style={{
              marginTop: "8px",
              color: "#64748B",
              fontSize: "15px",
              lineHeight: "24px",
            }}
          >
            {description}
          </p>
        </div>
      </div>

      <FiArrowRight
        size={24}
        color="#64748B"
      />
    </div>
  );
}