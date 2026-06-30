import {
  FiClock,
  FiShare2,
  FiDownload,
  FiArrowRight,
  FiAward,
} from "react-icons/fi";
import { downloadQuestionPaper } from "../../../services/questionPaper.service";
import {
  
  updateQuestionPaperPublishStatus,
} from "../../../services/questionPaper.service";
export default function QuestionPaperCard({ paper, onOpen }) {
  const colors = {
    blue: "#DFF0FF",
    purple: "#EEE6FF",
    green: "#DFF8F4",
    orange: "#FFF1DE",
  };
  const handleShare = async (token) => {

  if (!token) {
    return alert(
      "Please publish the paper before sharing."
    );
  }

  const url =
    `${window.location.origin}/shared-paper/${token}`;

  try {

    await navigator.clipboard.writeText(url);

    alert("Share link copied!");

  } catch (err) {

    console.error(err);

    alert("Unable to copy link.");
  }
};
  const handleDownload = async () => {
  try {
    const pdf = await downloadQuestionPaper(paper.id);

const blob = new Blob([pdf], {
  type: "application/pdf",
});


const url = window.URL.createObjectURL(blob);

    const link = document.createElement("a");

    link.href = url;

    link.download = `${paper.title}.pdf`;

    document.body.appendChild(link);

    link.click();

    link.remove();

    window.URL.revokeObjectURL(url);

  } catch (err) {
    console.error(err);
    alert("Download failed");
  }
};

const handlePublish = async () => {
  try {
    await updateQuestionPaperPublishStatus(
      paper.id,
      true
    );

    alert("Paper Published!");

    window.location.reload();

  } catch (err) {
    console.error(err);
    alert("Publish failed");
  }
};
  return (
    <div
      style={{
        background: colors[paper.color],
        border: `1px solid ${paper.border}`,
        borderRadius: "26px",
        padding: "22px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        minHeight: "255px",
      }}
    >
      {/* Top */}

      <div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: "15px",
          }}
        >
          <span
            style={{
              fontSize: "13px",
              color: "#64748B",
              letterSpacing: "1px",
              fontWeight: 400,
            }}
          >
            {paper.code}
          </span>

          <span
            style={{
              background:
                paper.status === "Published"
                  ? "#DCFCE7"
                  : "#FEF3C7",

              color:
                paper.status === "Published"
                  ? "#15803D"
                  : "#B45309",

              padding: "5px 12px",
              borderRadius: "20px",
              fontSize: "12px",
              fontWeight: 600,
            }}
          >
            {paper.status}
          </span>
        </div>

        <h2
          style={{
            margin: 0,
            color: "#0F172A",
            fontSize: "20px",
            fontWeight: 500,
          }}
        >
          {paper.title}
        </h2>
      </div>

      {/* Middle */}

      <div
        style={{
          display: "flex",
          gap: "12px",
          marginTop: "22px",
        }}
      >
        <InfoBox title="Type" value={paper.type} />

        <InfoBox
          title="Duration"
          value={
            <>
              <FiClock /> {paper.duration}
            </>
          }
        />

        <InfoBox
          title="Marks"
          value={
            <>
              <FiAward /> {paper.marks}
            </>
          }
        />
      </div>

      {/* Bottom */}

      <div
        style={{
          marginTop: "24px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <span
          style={{
            color: "#64748B",
            fontSize: "14px",
          }}
        >
          {paper.updated}
        </span>

        <div
          style={{
            display: "flex",
            gap: "10px",
            alignItems: "center",
          }}
        >
         <CircleIcon
  onClick={() => handleShare(paper.share_token)}
>
  <FiShare2 />
</CircleIcon>

          <CircleIcon onClick={handleDownload}>
    <FiDownload />
</CircleIcon>
<button onClick={handlePublish} style={{
              background: "#111827",
              color: "#fff",
              border: "none",
              borderRadius: "20px",
              padding: "10px 18px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "6px",
            }}>
  Publish
</button>

          <button
            onClick={() => onOpen?.()}
            style={{
              background: "#111827",
              color: "#fff",
              border: "none",
              borderRadius: "20px",
              padding: "10px 18px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "6px",
            }}
          >
            Open
            <FiArrowRight />
          </button>
        </div>
      </div>
    </div>
  );
}

function InfoBox({ title, value }) {
  return (
    <div
      style={{
        flex: 1,
        background: "#fff",
        borderRadius: "16px",
        padding: "10px",
      }}
    >
      <small
        style={{
          display: "block",
          color: "#64748B",
        }}
      >
        {title}
      </small>

      <div
        style={{
          marginTop: "6px",
          display: "flex",
          alignItems: "center",
          gap: "6px",
          fontWeight: 600,
        }}
      >
        {value}
      </div>
    </div>
  );
}

function CircleIcon({ children,onClick }) {
  return (
    <div
    onClick={onClick}
      style={{
        width: "36px",
        height: "36px",
        borderRadius: "50%",
        background: "#fff",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        cursor: "pointer",
      }}
    >
      {children}
    </div>
  );
}
