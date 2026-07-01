import McqCard from "./McqCard";
import NewPaperCard from "../mcq/NewMcqCard";

export default function McqGrid({
  mcqs,
  onNewClick,
  onPublish,
  onDownload,
  onDelete,
  search = "",
}) {
  const filteredMcqs = mcqs.filter((mcq) => {
    const keyword = search.toLowerCase();

    return (
      mcq.title?.toLowerCase().includes(keyword) ||
      mcq.Subject?.name?.toLowerCase().includes(keyword) ||
      mcq.Subject?.code?.toLowerCase().includes(keyword)
    );
  });

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill,minmax(420px,1fr))",
        gap: "26px",
        marginTop: "35px",
        alignItems: "stretch",
      }}
    >
      {filteredMcqs.length > 0 ? (
        filteredMcqs.map((mcq) => (
          <McqCard
            key={mcq.id}
            mcq={mcq}
            onPublish={onPublish}
            onDownload={onDownload}
            onDelete={onDelete}
          />
        ))
      ) : (
        <div
          style={{
            gridColumn: "1 / -1",
            background: "#fff",
            borderRadius: "24px",
            padding: "70px",
            textAlign: "center",
            border: "1px dashed #C7D2FE",
          }}
        >
          <h2
            style={{
              marginBottom: "12px",
              color: "#1E293B",
            }}
          >
            No MCQ Sets Found
          </h2>

          <p
            style={{
              color: "#64748B",
              margin: 0,
            }}
          >
            Generate your first AI MCQ set.
          </p>
        </div>
      )}

      <NewPaperCard onClick={onNewClick} />
    </div>
  );
}
