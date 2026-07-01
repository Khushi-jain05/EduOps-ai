import {
  FiAward,
  FiShare2,
  FiDownload,
  FiArrowRight,
} from "react-icons/fi";

import { publishMcq } from "../../../services/mcq.service";

export default function McqCard({ mcq }) {
  const handlePublish = async () => {
    try {
      await publishMcq(mcq.id);

      alert("MCQ Published");

      window.location.reload();

    } catch (err) {
      console.error(err);

      alert("Failed to publish");
    }
  };

  const handleShare = async () => {
    if (!mcq.share_token) {
      return alert("Publish the MCQ first.");
    }

    const url =
      `${window.location.origin}/shared-mcq/${mcq.share_token}`;

    await navigator.clipboard.writeText(url);

    alert("Share link copied!");
  };

  return (
    <div
      style={{
        background: "#EAF4FF",
        border: "1px solid #7CC5FF",
        borderRadius: "24px",
        padding: "22px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        minHeight: "250px",
      }}
    >
      <div>
        <small
          style={{
            color: "#64748B",
          }}
        >
          {mcq.Subject?.code} • {mcq.Subject?.name}
        </small>

        <h2
          style={{
            marginTop: "12px",
            marginBottom: "20px",
          }}
        >
          {mcq.title}
        </h2>

        <div
          style={{
            display: "flex",
            gap: "12px",
          }}
        >
          <InfoBox
            title="Questions"
            value={mcq.question_count}
          />

          <InfoBox
            title="Difficulty"
            value={mcq.difficulty}
          />

          <InfoBox
            title="Bloom"
            value={mcq.bloom_level}
          />
        </div>
      </div>

      <div
        style={{
          marginTop: "24px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <span>
          {mcq.status}
        </span>

        <div
          style={{
            display: "flex",
            gap: "10px",
          }}
        >
          <CircleIcon
            onClick={handleShare}
          >
            <FiShare2 />
          </CircleIcon>

          <CircleIcon>
            <FiDownload />
          </CircleIcon>

          {!mcq.is_published && (
            <button
              onClick={handlePublish}
              style={{
                background: "#111827",
                color: "#fff",
                border: "none",
                borderRadius: "20px",
                padding: "10px 18px",
                cursor: "pointer",
              }}
            >
              Publish
            </button>
          )}
          <button
            style={{
              background: "#111827",
              color: "#fff",
              border: "none",
              borderRadius: "20px",
              padding: "10px 18px",
              display: "flex",
              alignItems: "center",
              gap: "6px",
              cursor: "pointer",
            }}
          >
            Delete
            
          </button>
        

          <button
            style={{
              background: "#111827",
              color: "#fff",
              border: "none",
              borderRadius: "20px",
              padding: "10px 18px",
              display: "flex",
              alignItems: "center",
              gap: "6px",
              cursor: "pointer",
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
      <small>{title}</small>

      <div
        style={{
          marginTop: "8px",
          fontWeight: 600,
        }}
      >
        {value}
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