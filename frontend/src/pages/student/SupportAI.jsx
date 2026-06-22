import { useState } from "react";
import Sidebar from "../../components/layout/Sidebar";
import Navbar from "../../components/layout/Navbar";

import ChatSidebar from "../../components/supportAI/ChatSidebar";
import ChatHeader from "../../components/supportAI/ChatHeader";
import QuickActions from "../../components/supportAI/QuickActions";
import ChatMessages from "../../components/supportAI/ChatMessages";
import ChatInput from "../../components/supportAI/ChatInput";

import "../../styles/support-ai.css";

export default function SupportAI() {
  const [input, setInput] = useState("");

  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content:
        "Hi! I'm your Study Companion. Ask me anything from your syllabus, homework, doubts, revisions or exam prep."
    }
  ]);

  const [recentChats] = useState([
    "Newton's third law examples",
    "Quadratic equations practice",
    "Photosynthesis short notes",
    "Essay on climate change",
    "Trigonometry identities",
    "Python list comprehension"
  ]);

  const sendMessage = () => {
    if (!input.trim()) return;

    setMessages((prev) => [
      ...prev,
      {
        role: "user",
        content: input
      }
    ]);

    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "This is a demo AI response. Backend Gemini integration will come next."
        }
      ]);
    }, 1000);

    setInput("");
  };

  return (
    <div className="support-layout">
      <Sidebar />

      <div className="support-content">
        <Navbar />

        <div className="support-wrapper">

          <ChatSidebar chats={recentChats} />

          <div className="chat-main">

            <ChatHeader />

            {messages.length === 1 && (
   <QuickActions setInput={setInput} />
)}

            <ChatMessages messages={messages} />

            <ChatInput
              input={input}
              setInput={setInput}
              sendMessage={sendMessage}
            />

          </div>
        </div>
      </div>
    </div>
  );
}