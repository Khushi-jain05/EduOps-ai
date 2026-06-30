import QuestionPaperCard from "./QuestionPaperCard";
import NewPaperCard from "./NewPaperCard";

export default function QuestionPaperGrid({
  papers,
  onNewPaperClick,
  onOpenPaper,
}) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit,minmax(420px,1fr))",
        gap: "22px",
        marginTop: "30px",
        marginBottom: "40px",
      }}
    >
      {papers.length > 0 ? (
        papers.map((paper) => (
          <QuestionPaperCard
            key={paper.id}
            onOpen={() => onOpenPaper?.(paper)}
            paper={{
  id: paper.id,

  code: `${paper.Subject?.code || ""} • ${
    paper.Subject?.name || "Unknown Subject"
  }`,

  title: paper.title,

  type: paper.exam_type,

  duration: paper.duration,

  marks: paper.total_marks,

  status:
    paper.status === "published"
      ? "Published"
      : "Draft",

  updated: new Date(
    paper.updated_at
  ).toLocaleDateString(),

  color:
    paper.status === "published"
      ? "blue"
      : "green",

  border:
    paper.status === "published"
      ? "#7CC5FF"
      : "#8AE6D1",

  // ✅ ADD THESE
  share_token: paper.share_token,
  is_published: paper.is_published,
}}
          />
        ))
      ) : (
        <div
          style={{
            gridColumn: "1 / -1",
            textAlign: "center",
            color: "#64748B",
            fontSize: "18px",
            padding: "60px",
          }}
        >
          No Question Papers Found
        </div>
      )}

      <NewPaperCard onClick={onNewPaperClick} />
    </div>
  );
}
