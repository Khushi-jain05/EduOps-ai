import {
  FiFileText,
  FiClipboard,
  FiBookOpen,
  FiArrowRight,
} from "react-icons/fi";

const metaByType = {
  "Question Paper": {
    icon: <FiFileText />,
    color: "#2563EB",
  },
  "MCQ Set": {
    icon: <FiClipboard />,
    color: "#8B5CF6",
  },
  "Lesson Plan": {
    icon: <FiBookOpen />,
    color: "#10B981",
  },
};

const formatTime = (value) => {
  if (!value) return "";

  return new Date(value).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
  });
};

export default function RecentActivity({ activities = [] }) {
  return (
    <div
      style={{
        background: "#fff",
        borderRadius: "24px",
        padding: "28px",
        boxShadow: "0 10px 25px rgba(0,0,0,.04)",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "25px",
        }}
      >
        <div>
          <h2
            style={{
              margin: 0,
              fontSize: "26px",
              color: "#111827",
            }}
          >
            Recent AI Generations
          </h2>

          <p
            style={{
              color: "#64748B",
              marginTop: "8px",
            }}
          >
            Your latest generated resources
          </p>
        </div>

        <FiArrowRight
          size={22}
          color="#64748B"
          style={{ cursor: "pointer" }}
        />
      </div>

      {activities.length === 0 ? (
        <p style={{ color: "#64748B" }}>
          No generated resources yet.
        </p>
      ) : activities.map((item) => {
        const meta = metaByType[item.type] || metaByType["Question Paper"];

        return (
        <div
          key={`${item.type}-${item.id}`}
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "18px 0",
            borderBottom: "1px solid #EEF2F7",
          }}
        >
          <div
            style={{
              display: "flex",
              gap: "18px",
              alignItems: "center",
            }}
          >
            <div
              style={{
                width: "52px",
                height: "52px",
                borderRadius: "16px",
                background: meta.color,
                color: "#fff",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                fontSize: "22px",
              }}
            >
              {meta.icon}
            </div>

            <div>
              <h4
                style={{
                  margin: 0,
                  color: "#111827",
                }}
              >
                {item.title}
              </h4>

              <p
                style={{
                  marginTop: "6px",
                  color: "#64748B",
                  fontSize: "14px",
                }}
              >
                {item.type}
              </p>
            </div>
          </div>

          <span
            style={{
              color: "#94A3B8",
              fontSize: "14px",
            }}
          >
            {formatTime(item.createdAt)}
          </span>
        </div>
      );
      })}
    </div>
  );
}
