import { useState } from "react";

import ChatContainer from "../components/chat/ChatContainer";
import ChatInput from "../components/chat/ChatInput";

function Chat() {
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: "ai",
      message: "Hello Mridul 👋 I'm Astra. How can I help you today?",
    },
  ]);

  const handleSendMessage = async (text) => {
    if (!text.trim()) return;

    // User message
    const userMessage = {
      id: Date.now(),
      sender: "user",
      message: text,
    };

    setMessages((prev) => [...prev, userMessage]);

    try {
      const response = await fetch("http://localhost:5000/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: text,
        }),
      });

      const data = await response.json();

      const aiMessage = {
        id: Date.now() + 1,
        sender: "ai",
        message: data.reply,
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error(error);

      const errorMessage = {
        id: Date.now() + 1,
        sender: "ai",
        message: "❌ Unable to connect to the backend.",
      };

      setMessages((prev) => [...prev, errorMessage]);
    }
  };

  return (
    <div className="flex h-[calc(100vh-140px)] flex-col gap-4">
      <div>
        <h1 className="text-4xl font-bold text-white">
          Astra Chat
        </h1>

        <p className="mt-2 text-slate-400">
          Talk with your AI assistant.
        </p>
      </div>

      <div className="flex flex-1 flex-col gap-4">
        <ChatContainer messages={messages} />

        <ChatInput onSend={handleSendMessage} />
      </div>
    </div>
  );
}

export default Chat;