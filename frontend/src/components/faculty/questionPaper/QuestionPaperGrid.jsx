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
        gridTemplateColumns:
          "repeat(auto-fill,minmax(390px,1fr))",
        gap: "20px",
        marginTop: "35px",
        paddingBottom: "40px",
      }}
    >
      {papers.length > 0 ? (
        papers.map((paper) => (
          <QuestionPaperCard
            key={paper.id}
            onOpen={() => onOpenPaper?.(paper)}
            paper={{
              id: paper.id,

              code: paper.Subject?.code || "",

              subject:
                paper.Subject?.name ||
                "Unknown Subject",

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

              difficulty:
                paper.difficulty || "Medium",

              share_token: paper.share_token,

              is_published:
                paper.is_published,
            }}
          />
        ))
      ) : (
        <div
          style={{
            gridColumn: "1 / -1",
            padding: "90px",
            textAlign: "center",
            color: "#64748B",
            fontSize: "20px",
            fontWeight: 500,
          }}
        >
          No Question Papers Found
        </div>
      )}

      <NewPaperCard
        onClick={onNewPaperClick}
      />
    </div>
  );
}