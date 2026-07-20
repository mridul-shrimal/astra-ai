import { useEffect, useState } from "react";

import ChatContainer from "../components/chat/ChatContainer";
import ChatInput from "../components/chat/ChatInput";
import ChatSidebar from "../components/chat/ChatSidebar";

function Chat() {
  const createNewChat = () => ({
    id: crypto.randomUUID(),
    sessionId: crypto.randomUUID(),
    title: "New Chat",
    messages: [
      {
        id: Date.now(),
        sender: "ai",
        message: "Hello Mridul 👋 I'm Astra. How can I help you today?",
      },
    ],
  });

  // Load chats from localStorage
  const [chats, setChats] = useState(() => {
    const saved = localStorage.getItem("astra-chats");

    if (saved) {
      return JSON.parse(saved);
    }

    return [createNewChat()];
  });

  // Current chat
  const [currentChatId, setCurrentChatId] = useState(() => {
    return localStorage.getItem("astra-current-chat") || null;
  });

  // Select first chat if none selected
  useEffect(() => {
    if (!currentChatId && chats.length) {
      setCurrentChatId(chats[0].id);
    }
  }, [currentChatId, chats]);

  // Save chats
  useEffect(() => {
    localStorage.setItem("astra-chats", JSON.stringify(chats));
  }, [chats]);

  // Save selected chat
  useEffect(() => {
    if (currentChatId) {
      localStorage.setItem("astra-current-chat", currentChatId);
    }
  }, [currentChatId]);

  const currentChat =
    chats.find((chat) => chat.id === currentChatId) || chats[0];

  const [isTyping, setIsTyping] = useState(false);

  const updateCurrentMessages = (messages) => {
    setChats((prev) =>
      prev.map((chat) =>
        chat.id === currentChat.id
          ? {
              ...chat,
              messages,
            }
          : chat
      )
    );
  };

  const handleSendMessage = async (text) => {
    if (!text.trim()) return;

    const userMessage = {
      id: Date.now(),
      sender: "user",
      message: text,
    };

    const updatedMessages = [...currentChat.messages, userMessage];

    updateCurrentMessages(updatedMessages);

    // Rename first chat automatically
    if (currentChat.title === "New Chat") {
      setChats((prev) =>
        prev.map((chat) =>
          chat.id === currentChat.id
            ? {
                ...chat,
                title: text.substring(0, 30),
              }
            : chat
        )
      );
    }

    setIsTyping(true);

    try {
      const response = await fetch("http://localhost:5000/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: text,
          sessionId: currentChat.sessionId,
        }),
      });

      const data = await response.json();

      setIsTyping(false);

      const aiId = Date.now() + 1;

      const aiMessage = {
        id: aiId,
        sender: "ai",
        message: data.reply,
      };

      updateCurrentMessages([...updatedMessages, aiMessage]);
    } catch (error) {
      console.error(error);

      setIsTyping(false);

      updateCurrentMessages([
        ...updatedMessages,
        {
          id: Date.now() + 1,
          sender: "ai",
          message: "❌ Unable to connect to the backend.",
        },
      ]);
    }
  };

  const handleNewChat = () => {
    const newChat = createNewChat();

    setChats((prev) => [newChat, ...prev]);

    setCurrentChatId(newChat.id);
  };

  return (
    <div className="flex h-[calc(100vh-140px)]">
      <ChatSidebar
  chats={chats}
  currentChatId={currentChatId}
  onNewChat={handleNewChat}
  onSelectChat={setCurrentChatId}
/>

      <div className="flex flex-1 flex-col gap-4 p-6">
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
            messages={currentChat.messages}
            isTyping={isTyping}
          />

          <ChatInput onSend={handleSendMessage} />
        </div>
      </div>
    </div>
  );
}

export default Chat;