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

  const handleSendMessage = (text) => {
    if (!text.trim()) return;

    const newMessage = {
      id: Date.now(),
      sender: "user",
      message: text,
    };

    setMessages((prevMessages) => [...prevMessages, newMessage]);
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