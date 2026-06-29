import { FiPlus } from "react-icons/fi";

export default function NewPaperCard({ onClick }) {
  return (
    <div
      onClick={onClick}
      style={{
        border: "2px dashed #8BD2FF",
        borderRadius: "28px",
        background: "#F8FCFF",
        minHeight: "255px",

        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",

        cursor: "pointer",
        transition: ".3s",
      }}
    >
      <div
        style={{
          width: "62px",
          height: "62px",
          borderRadius: "50%",
          background:
            "linear-gradient(135deg,#0EA5E9,#2563EB)",

          color: "#fff",

          display: "flex",
          justifyContent: "center",
          alignItems: "center",

          fontSize: "28px",

          marginBottom: "20px",
        }}
      >
        <FiPlus />
      </div>

      <h3
        style={{
          margin: 0,
          color: "#2563EB",
          fontSize: "28px",
        }}
      >
        Generate new paper
      </h3>

      <p
        style={{
          color: "#64748B",
          marginTop: "8px",
          fontSize: "16px",
        }}
      >
        AI builds it in 10 seconds
      </p>
    </div>
  );
}