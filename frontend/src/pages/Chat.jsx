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

  // Load chats
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

  // Select first chat
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

  // Rename Chat
  const handleRenameChat = (chatId) => {
  const chat = chats.find((c) => c.id === chatId);

  const newTitle = prompt(
    "Rename chat",
    chat?.title || ""
  );

  if (!newTitle || !newTitle.trim()) return;

  setChats((prev) =>
    prev.map((chat) =>
      chat.id === chatId
        ? {
            ...chat,
            title: newTitle.trim(),
          }
        : chat
    )
  );
};
  // Delete Chat
  const handleDeleteChat = (chatId) => {
  if (chats.length === 1) {
    alert("At least one chat must remain.");
    return;
  }

  if (!window.confirm("Are you sure you want to delete this chat?")) {
    return;
  }

  const updatedChats = chats.filter(
    (chat) => chat.id !== chatId
  );

  setChats(updatedChats);

  if (currentChatId === chatId) {
    setCurrentChatId(updatedChats[0].id);
  }
};
const streamMessage = async (
  text,
  messageId,
  existingMessages
) => {
  let current = "";

  for (let i = 0; i < text.length; i += 3) {
    current += text.slice(i, i + 3);

    updateCurrentMessages(
      existingMessages.map((msg) =>
        msg.id === messageId
          ? {
              ...msg,
              message: current,
            }
          : msg
      )
    );

    await new Promise((resolve) =>
      setTimeout(resolve, 8)
    );
  }
};
  const handleSendMessage = async (text) => {
    if (!text.trim()) return;

    const userMessage = {
      id: Date.now(),
      sender: "user",
      message: text,
    };

    const updatedMessages = [
      ...currentChat.messages,
      userMessage,
    ];

    updateCurrentMessages(updatedMessages);

    // Rename first message automatically
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
      const response = await fetch(
        "http://localhost:5000/api/chat",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            message: text,
            sessionId: currentChat.sessionId,
          }),
        }
      );

      const data = await response.json();

      setIsTyping(false);

      const aiId = Date.now() + 1;

const aiMessage = {
  id: aiId,
  sender: "ai",
  message: "",
};

const newMessages = [
  ...updatedMessages,
  aiMessage,
];

updateCurrentMessages(newMessages);

await streamMessage(
  data.reply,
  aiId,
  newMessages
);
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
const handleRegenerate = async () => {
  // Find the last user message
  const lastUserMessage = [...currentChat.messages]
    .reverse()
    .find((msg) => msg.sender === "user");

  if (!lastUserMessage) return;

  // Remove the last AI message (if there is one)
  let updatedMessages = [...currentChat.messages];

  if (
    updatedMessages.length &&
    updatedMessages[updatedMessages.length - 1].sender === "ai"
  ) {
    updatedMessages.pop();
  }

  updateCurrentMessages(updatedMessages);

  setIsTyping(true);

  try {
    const response = await fetch("http://localhost:5000/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: lastUserMessage.message,
        sessionId: currentChat.sessionId,
      }),
    });

    const data = await response.json();

    setIsTyping(false);

    const aiMessage = {
      id: Date.now(),
      sender: "ai",
      message: data.reply,
    };

    updateCurrentMessages([
      ...updatedMessages,
      aiMessage,
    ]);
  } catch (error) {
    console.error(error);

    setIsTyping(false);

    updateCurrentMessages([
      ...updatedMessages,
      {
        id: Date.now(),
        sender: "ai",
        message: "❌ Failed to regenerate response.",
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
        currentChatId={currentChat.id}
        onNewChat={handleNewChat}
        onSelectChat={setCurrentChatId}
        onRenameChat={handleRenameChat}
        onDeleteChat={handleDeleteChat}
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
            onRegenerate={handleRegenerate}
          />

          <ChatInput onSend={handleSendMessage} />
        </div>
      </div>
    </div>
  );
}

export default Chat;
