import {
  Paperclip,
  Send,
  Mic,
} from "lucide-react";

export default function ChatInput({
  input,
  setInput,
  sendMessage,
}) {
  return (
    <div className="chat-input">

      <Paperclip size={20} />

      <input
        value={input}
        placeholder="Ask anything from your syllabus..."
        onChange={(e) =>
          setInput(e.target.value)
        }
        onKeyDown={(e) =>
          e.key === "Enter" &&
          sendMessage()
        }
      />

      <Mic size={20} />

      <button
  className="send-btn"
  onClick={sendMessage}
>
  <Send size={20} />
</button>

    </div>
  );
}