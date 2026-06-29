import {
  FiFileText,
  FiCheckCircle,
  FiEdit3,
  FiAward,
} from "react-icons/fi";

const stats = [
  {
    title: "Papers",
    value: 4,
    icon: <FiFileText size={22} />,
    color: "#0EA5E9",
  },
  {
    title: "Published",
    value: 2,
    icon: <FiCheckCircle size={22} />,
    color: "#10B981",
  },
  {
    title: "Drafts",
    value: 2,
    icon: <FiEdit3 size={22} />,
    color: "#F97316",
  },
//   {
//     title: "Avg. marks",
//     value: 53,
//     icon: <FiAward size={22} />,
//     color: "#A855F7",
//   },
];

export default function QuestionPaperStats() {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(3,1fr)",
        gap: "20px",
        marginTop: "25px",
        marginBottom: "25px",
      }}
    >
      {stats.map((item) => (
        <div
          key={item.title}
          style={{
            background: "#fff",
            borderRadius: "22px",
            padding: "24px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            boxShadow: "0 8px 25px rgba(15,23,42,.05)",
          }}
        >
          <div>
            <p
              style={{
                margin: 0,
                color: "#64748B",
                fontSize: "15px",
              }}
            >
              {item.title}
            </p>

            <h2
              style={{
                margin: "15px 0 0",
                fontSize: "48px",
                fontWeight: "700",
                color: "#0F172A",
              }}
            >
              {item.value}
            </h2>
          </div>

          <div
            style={{
              width: "58px",
              height: "58px",
              borderRadius: "50%",
              background: item.color,
              color: "#fff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 10px 25px rgba(0,0,0,.12)",
            }}
          >
            {item.icon}
          </div>
        </div>
      ))}
    </div>
  );
}