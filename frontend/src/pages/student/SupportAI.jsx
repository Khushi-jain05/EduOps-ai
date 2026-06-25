import { useState, useEffect } from "react";

import Sidebar from "../../components/layout/Sidebar";
import Navbar from "../../components/layout/Navbar";

import ChatSidebar from "../../components/supportAI/ChatSidebar";
import ChatHeader from "../../components/supportAI/ChatHeader";
import QuickActions from "../../components/supportAI/QuickActions";
import ChatMessages from "../../components/supportAI/ChatMessages";
import ChatInput from "../../components/supportAI/ChatInput";

import {
  sendMessage as sendAIMessage,
  getChats,
} from "../../services/supportAI.service";

import "../../styles/support-ai.css";

export default function SupportAI() {

  const [input, setInput] = useState("");

  const [loading, setLoading] = useState(true);

  const [chats, setChats] = useState([]);

  const [messages, setMessages] = useState([
    {
      id: 1,
      role: "assistant",
      content:
        "Hi! I'm your Study Companion. Ask me anything from your syllabus, homework, doubts, revisions or exam prep.",
    },
  ]);

  useEffect(() => {
    loadChats();
  }, []);

  const loadChats = async () => {
    try {

      const data = await getChats();

      console.log("Chats:", data);

      setChats(data || []);

    } catch (error) {

      console.log(error);

    } finally {

      setLoading(false);

    }
  };

  const sendMessage = async () => {

    if (!input.trim()) return;

    const currentInput = input;

    setMessages((prev) => [
      ...prev,
      {
        id: Date.now(),
        role: "user",
        content: currentInput,
      },
    ]);

    setInput("");

    try {

      const response = await sendAIMessage(
        "demo-chat-id",
        currentInput
      );

      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          role: "assistant",
          content:
            response.reply ||
            "No response received",
        },
      ]);

      loadChats();

    } catch (error) {

      console.log(error);

      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 2,
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

          <ChatSidebar
            chats={chats}
            loading={loading}
          />

          <div className="chat-main">

            <ChatHeader />

            {messages.length === 1 && (
              <QuickActions
                setInput={setInput}
              />
            )}

            <ChatMessages
              messages={messages}
            />

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