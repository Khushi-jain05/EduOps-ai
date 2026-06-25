import { Plus, FileText } from "lucide-react";

export default function ChatSidebar({
  chats,
  loading,
}) {
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

        {loading ? (

          <p className="loading-text">
            Loading...
          </p>

        ) : chats.length === 0 ? (

          <p className="loading-text">
            No Chats Yet
          </p>

        ) : (

          chats.map((chat) => (

            <div
              key={chat.id}
              className="chat-item"
            >
              <FileText size={16} />

              <span>
                {chat.title}
              </span>

            </div>

          ))

        )}

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