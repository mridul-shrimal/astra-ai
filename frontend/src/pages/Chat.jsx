import { useState } from "react";

import ChatContainer from "../components/chat/ChatContainer";
import ChatInput from "../components/chat/ChatInput";

function Chat() {
  // Create one session id per browser
  const [sessionId] = useState(() => {
    let id = localStorage.getItem("astra-session");

    if (!id) {
      id = crypto.randomUUID();
      localStorage.setItem("astra-session", id);
    }

    return id;
  });

  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: "ai",
      message: "Hello Mridul 👋 I'm Astra. How can I help you today?",
    },
  ]);

  const [isTyping, setIsTyping] = useState(false);

  const typeMessage = async (text, messageId) => {
    let current = "";

    for (let i = 0; i < text.length; i++) {
      current += text[i];

      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === messageId
            ? {
                ...msg,
                message: current,
              }
            : msg
        )
      );

      await new Promise((resolve) => setTimeout(resolve, 15));
    }
  };

  const handleSendMessage = async (text) => {
    if (!text.trim()) return;

    const userMessage = {
      id: Date.now(),
      sender: "user",
      message: text,
    };

    setMessages((prev) => [...prev, userMessage]);

    setIsTyping(true);

    try {
      const response = await fetch("http://localhost:5000/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: text,
          sessionId: sessionId,
        }),
      });

      const data = await response.json();

      setIsTyping(false);

      const aiId = Date.now() + 1;

      const emptyAIMessage = {
        id: aiId,
        sender: "ai",
        message: "",
      };

      setMessages((prev) => [...prev, emptyAIMessage]);

      await typeMessage(data.reply, aiId);
    } catch (error) {
      console.error(error);

      setIsTyping(false);

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
        <ChatContainer
          messages={messages}
          isTyping={isTyping}
        />

        <ChatInput onSend={handleSendMessage} />
      </div>
    </div>
  );
}

export default Chat;