import { Plus, FileText } from "lucide-react";

export default function ChatSidebar({ chats }) {
  return (
    <div className="chat-sidebar">

      <button className="new-chat-btn">
        <Plus size={18} />
        <span>New Chat</span>
      </button>

      <p className="recent-label">
        RECENT
      </p>

      <div className="chat-list">

        {chats.map((chat, index) => (
          <div
            key={index}
            className="chat-item"
          >
            <FileText size={16} />

            <span>{chat}</span>
          </div>
        ))}

      </div>

      <div className="tip-box">
        <strong>Tip</strong>

        <p>
          Paste a question, photo or PDF —
          I'll explain it like your favourite teacher.
        </p>
      </div>

    </div>
  );
}