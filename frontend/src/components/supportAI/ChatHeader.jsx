import { Sparkles, GraduationCap, Lightbulb } from "lucide-react";

export default function ChatHeader() {
  return (
    <div className="chat-header">

      <div className="chat-title">

        <div className="chat-avatar">
          <Sparkles size={24} />
        </div>

        <div>
          <h3>Study Companion</h3>

          <p>
            <span className="online-dot"></span>
            Online • Gemini 2.5 Flash
          </p>
        </div>

      </div>

      <div className="chat-actions">

        <button>
          <GraduationCap size={16}/>
          Grade 12
        </button>

        <button>
          <Lightbulb size={16}/>
          Explain Mode
        </button>

      </div>

    </div>
  );
}