import McqCard from "./McqCard";
import NewPaperCard from "../questionPaper/NewPaperCard";

export default function McqGrid({
  mcqs,
  onNewClick,
}) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns:
          "repeat(auto-fit,minmax(420px,1fr))",
        gap: "22px",
        marginTop: "30px",
      }}
    >
      {mcqs.length > 0 ? (
        mcqs.map((mcq) => (
          <McqCard
            key={mcq.id}
            mcq={mcq}
          />
        ))
      ) : (
        <div
          style={{
            gridColumn: "1/-1",
            textAlign: "center",
            color: "#64748B",
            padding: "60px",
          }}
        >
          No MCQ Sets Found
        </div>
      )}

      <NewPaperCard
        onClick={onNewClick}
      />
    </div>
  );
}