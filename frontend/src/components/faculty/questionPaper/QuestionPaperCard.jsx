import {
  FiClock,
  FiShare2,
  FiDownload,
  FiArrowRight,
  FiAward,
  FiFileText,
} from "react-icons/fi";

import {
  downloadQuestionPaper,
  updateQuestionPaperPublishStatus,
} from "../../../services/questionPaper.service";

export default function QuestionPaperCard({
  paper,
  onOpen,
}) {
  const handlePublish = async () => {
    try {
      await updateQuestionPaperPublishStatus(
        paper.id,
        true
      );

      alert("Paper Published");

      window.location.reload();
    } catch (err) {
      console.error(err);
      alert("Publish failed");
    }
  };

  const handleDownload = async () => {
    try {
      const pdf =
        await downloadQuestionPaper(paper.id);

      const blob = new Blob([pdf], {
        type: "application/pdf",
      });

      const url =
        window.URL.createObjectURL(blob);

      const link =
        document.createElement("a");

      link.href = url;
      link.download = `${paper.title}.pdf`;

      document.body.appendChild(link);

      link.click();

      link.remove();

      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
      alert("Download Failed");
    }
  };

  const handleShare = async () => {
    if (!paper.share_token)
      return alert(
        "Publish the paper first."
      );

    await navigator.clipboard.writeText(
      `${window.location.origin}/shared-paper/${paper.share_token}`
    );

    alert("Share link copied!");
  };

  return (
    <div
      style={{
        background: "#fff",
        borderRadius: "28px",
        padding: "26px",
        boxShadow:
          "0 12px 35px rgba(15,23,42,.08)",
        border: "1px solid #E7EEF8",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        minHeight: "360px",
        transition: ".25s",
      }}
    >
      {/* Header */}

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
        }}
      >
        <div>
          <div
            style={{
              color: "#2563EB",
              fontWeight: 700,
              fontSize: "15px",
            }}
          >
            {paper.code}
          </div>

          <div
            style={{
              color: "#64748B",
              marginTop: "3px",
              fontSize: "16px",
            }}
          >
            {paper.subject}
          </div>
        </div>

        <span
          style={{
            background:
              "#FFF4E5",
            color: "#F59E0B",
            padding:
              "8px 16px",
            borderRadius: "30px",
            fontWeight: 600,
            fontSize: "13px",
          }}
        >
          {paper.type}
        </span>
      </div>

      {/* Title */}

      <h2
        style={{
          marginTop: "22px",
          marginBottom: "26px",
          fontSize: "22px",
          color: "#172554",
        }}
      >
        {paper.title}
      </h2>

      {/* Middle */}

      <div
        style={{
          display: "flex",
          justifyContent:
            "space-between",
          alignItems: "center",
        }}
      >
        <div>
          <div
            style={{
              fontSize: "40px",
              fontWeight: 700,
              color: "#172554",
              lineHeight: 1,
            }}
          >
            {paper.marks}
          </div>

          <div
            style={{
              color: "#64748B",
              fontSize: "18px",
              marginTop: "8px",
            }}
          >
            Total Marks
          </div>
        </div>

        <div
          style={{
            width: "62px",
            height: "62px",
            borderRadius: "26px",
            background:
              "#E8EEFF",
            display: "flex",
            justifyContent:
              "center",
            alignItems: "center",
            color: "#2563EB",
            fontSize: "32px",
          }}
        >
          <FiFileText />
        </div>
      </div>

      {/* Duration */}

      <div
        style={{
          marginTop: "28px",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent:
              "space-between",
            marginBottom: "8px",
            color: "#64748B",
          }}
        >
          <span>Duration</span>

          <span>
            {paper.duration}
          </span>
        </div>

        <div
          style={{
            height: "8px",
            background:
              "#E8EEF7",
            borderRadius: "20px",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              width: "75%",
              height: "100%",
              background:
                "linear-gradient(90deg,#2563EB,#60A5FA)",
            }}
          />
        </div>
      </div>

      {/* Bottom */}

      <div
        style={{
          marginTop: "30px",
          display: "flex",
          justifyContent:
            "space-between",
          alignItems: "center",
        }}
      >
        <div>
          <div
            style={{
              color: "#64748B",
            }}
          >
            Status
          </div>

          <div
            style={{
              fontWeight: 700,
              fontSize: "22px",
              color:
                paper.status ===
                "Published"
                  ? "#16A34A"
                  : "#F59E0B",
            }}
          >
            {paper.status}
          </div>
        </div>

        <button
          onClick={onOpen}
          style={{
            background:
              "linear-gradient(90deg,#2563EB,#4F8EF7)",
            color: "#fff",
            border: "none",
            borderRadius: "16px",
            padding:
              "12px 12px",
            display: "flex",
            alignItems: "center",
            gap: "8px",
            cursor: "pointer",
            fontWeight: 500,
            fontSize: "15px",
          }}
        >
          Open Paper

          <FiArrowRight />
        </button>
      </div>

      {/* Actions */}

      <div
        style={{
          display: "flex",
          gap: "12px",
          marginTop: "22px",
        }}
      >
        <CircleIcon
          onClick={handleShare}
        >
          <FiShare2 />
        </CircleIcon>

        <CircleIcon
          onClick={handleDownload}
        >
          <FiDownload />
        </CircleIcon>

        {!paper.is_published && (
          <button
            onClick={handlePublish}
            style={{
              border: "none",
              background:
                "#111827",
              color: "#fff",
              borderRadius:
                "16px",
              padding:
                "10px 18px",
              cursor: "pointer",
              fontWeight: 600,
            }}
          >
            Publish
          </button>
        )}
      </div>
    </div>
  );
}

function CircleIcon({
  children,
  onClick,
}) {
  return (
    <div
      onClick={onClick}
      style={{
        width: "42px",
        height: "42px",
        borderRadius: "50%",
        background: "#F8FAFC",
        display: "flex",
        justifyContent:
          "center",
        alignItems: "center",
        cursor: "pointer",
        border:
          "1px solid #E2E8F0",
      }}
    >
      {children}
    </div>
  );
}