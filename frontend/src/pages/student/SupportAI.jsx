import { useState } from "react";
import Sidebar from "../../components/layout/Sidebar";
import Navbar from "../../components/layout/Navbar";
import {
  sendMessage as sendAIMessage
} from "../../services/supportAI.service";
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
      id:1,
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

  const sendMessage = async () => {
  if (!input.trim()) return;

  const userMessage = {
    role: "user",
    content: input,
  };

  setMessages((prev) => [
    ...prev,
    userMessage,
  ]);

  const currentInput = input;
  setInput("");

  try {
    const response =
      await sendAIMessage(
        "demo-chat-id",
        currentInput
      );

    setMessages((prev) => [
      ...prev,
      {
        role: "assistant",
        content:
          response.assistant?.content ||
          "No response received",
      },
    ]);
  } catch (error) {
    console.log(error);

    setMessages((prev) => [
      ...prev,
      {
        role: "assistant",
        content:
          "Sorry, something went wrong.",
      },
    ]);
  }
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