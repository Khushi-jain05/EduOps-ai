import { FiPlus } from "react-icons/fi";

export default function NewPaperCard({ onClick }) {
  return (
    <div
      onClick={onClick}
      style={{
        borderRadius: "30px",
        minHeight: "320px",
        cursor: "pointer",

        background:
          "linear-gradient(145deg,#EFF6FF,#FFFFFF)",

        border: "2px dashed #93C5FD",

        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",

        transition: ".3s",

        boxShadow:
          "0 10px 30px rgba(37,99,235,.08)",
      }}
    >
      <div
        style={{
          width: "62px",
          height: "62px",
          borderRadius: "50%",

          background:
            "linear-gradient(135deg,#2563EB,#60A5FA)",

          color: "#fff",

          display: "flex",
          justifyContent: "center",
          alignItems: "center",

          fontSize: "38px",

          marginBottom: "25px",

          boxShadow:
            "0 15px 35px rgba(37,99,235,.25)",
        }}
      >
        <FiPlus />
      </div>

      <h2
        style={{
          margin: 0,
          color: "#2563EB",
          fontSize: "28px",
          fontWeight: 700,
        }}
      >
        New Question Paper
      </h2>

      <p
        style={{
          width: "75%",
          textAlign: "center",

          color: "#64748B",

          marginTop: "13px",

          lineHeight: "28px",

          fontSize: "16px",
        }}
      >
        Generate AI-powered question papers
        from Question Bank, PDFs,
        Study Material and Bloom Taxonomy.
      </p>

      <button
        style={{
          marginTop: "20px",

          background:
            "linear-gradient(135deg,#2563EB,#3B82F6)",

          color: "#fff",

          border: "none",

          borderRadius: "14px",

          padding: "14px 26px",

          cursor: "pointer",

          fontWeight: 600,

          fontSize: "16px",

          boxShadow:
            "0 10px 25px rgba(37,99,235,.25)",
        }}
      >
        Generate Paper
      </button>
    </div>
  );
}