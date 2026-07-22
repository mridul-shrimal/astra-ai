import { useEffect, useRef, useState } from "react";
import { jsPDF } from "jspdf";
import ExportModal from "../components/chat/ExportModal";
import { Menu } from "lucide-react";
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

  // Export Modal State
const [exportOpen, setExportOpen] = useState(false);
const [selectedFormat, setSelectedFormat] = useState("pdf");
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
// 🔍 Search Query
const [searchQuery, setSearchQuery] = useState("");
const [sidebarOpen, setSidebarOpen] = useState(true);
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
const [isGenerating, setIsGenerating] = useState(false);
const stopGenerationRef = useRef(false);
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

  // Export Chat
  const handleExportChat = () => {
  setExportOpen(false);

  if (!currentChat) return;
const messages = currentChat.messages;

const plainText = messages
  .map((msg) => {
    const sender = msg.sender === "user" ? "You" : "Astra";
    return `${sender}\n\n${msg.message}`;
  })
  .join("\n\n----------------------------------------\n\n");

const markdown = messages
  .map((msg) => {
    const sender = msg.sender === "user" ? "## You" : "## Astra";
    return `${sender}\n\n${msg.message}`;
  })
  .join("\n\n---\n\n");

const html = `
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>${currentChat.title}</title>

<style>
body{
font-family:Arial,sans-serif;
background:#0f172a;
color:white;
padding:40px;
line-height:1.7;
}

.message{
margin-bottom:30px;
padding:20px;
border-radius:12px;
background:#1e293b;
}

.user{
border-left:5px solid #06b6d4;
}

.ai{
border-left:5px solid #8b5cf6;
}

h2{
margin-top:0;
}
</style>

</head>

<body>

<h1>${currentChat.title}</h1>

${messages
  .map(
    (msg) => `
<div class="message ${msg.sender}">
<h2>${msg.sender === "user" ? "You" : "Astra"}</h2>
<p>${msg.message.replace(/\n/g, "<br>")}</p>
</div>
`
  )
  .join("")}

</body>
</html>
`;

const json = JSON.stringify(messages, null, 2);
const downloadFile = (content, filename, type) => {
  const blob = new Blob([content], { type });

  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");

  link.href = url;
  link.download = filename;

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  URL.revokeObjectURL(url);
};

  /// PDF
if (selectedFormat === "pdf") {
  const pdf = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();

  const margin = 15;
  const lineHeight = 7;

  let y = 20;
  let page = 1;

  // Title
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(18);
  pdf.text("Astra AI Conversation", margin, y);

  y += 12;

  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(11);

  const lines = pdf.splitTextToSize(
    plainText,
    pageWidth - margin * 2
  );

  lines.forEach((line) => {
    // New page if needed
    if (y > pageHeight - 20) {
      pdf.setFontSize(10);
      pdf.text(
        `Page ${page}`,
        pageWidth - 30,
        pageHeight - 8
      );

      pdf.addPage();

      page++;

      y = 20;

      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(11);
    }

    pdf.text(line, margin, y);

    y += lineHeight;
  });

  // Last page number
  pdf.setFontSize(10);
  pdf.text(
    `Page ${page}`,
    pageWidth - 30,
    pageHeight - 8
  );

  pdf.save(`${currentChat.title || "chat"} - Astra AI.pdf`);

  return;
}

  // TXT (existing)
  if (selectedFormat === "txt") {
  downloadFile(
    plainText,
    `${currentChat.title || "chat"}.txt`,
    "text/plain;charset=utf-8"
  );
  return;
}

if (selectedFormat === "md") {
  downloadFile(
    markdown,
    `${currentChat.title || "chat"}.md`,
    "text/markdown;charset=utf-8"
  );
  return;
}

if (selectedFormat === "html") {
  downloadFile(
    html,
    `${currentChat.title || "chat"}.html`,
    "text/html;charset=utf-8"
  );
  return;
}

if (selectedFormat === "json") {
  downloadFile(
    json,
    `${currentChat.title || "chat"}.json`,
    "application/json"
  );
  return;
}

  alert(`${selectedFormat.toUpperCase()} export coming next.`);
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
      if (stopGenerationRef.current) {
      setIsTyping(false);
      setIsGenerating(false);
      return;
    }
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
  const handleSendMessage = async (text,files) => {
      speechSynthesis.cancel(); 
    if (!text.trim() && files.length === 0) return;

const userMessage = {
  id: Date.now(),
  sender: "user",
  message: text || "Uploaded document(s)",
 files: files.map((file) => ({
  name: file.name,
  type: file.type,
  size: file.size,
  preview: URL.createObjectURL(file),
})),
};

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
    
stopGenerationRef.current = false;
    setIsTyping(true);
setIsGenerating(true);
    try {
      const formData = new FormData();

formData.append("message", text);
formData.append("sessionId", currentChat.sessionId);

files.forEach((file) => {
  formData.append("files", file);
});
// Show user message immediately
updateCurrentMessages([
  ...currentChat.messages,
  userMessage,
]);
const response = await fetch(
  "http://localhost:5000/api/chat",
  {
    method: "POST",
    body: formData,
  }
);

      const data = await response.json();

// Final user message with uploaded file info
const finalUserMessage = {
  ...userMessage,
  files: data.files
    ? data.files.map((file) => ({
        name: file.originalname,
        type: file.mimetype,
        size: file.size,
        filename: file.filename,
      }))
    : userMessage.files,
};

// Update the already displayed message with backend file info
const updatedMessages = [
  ...currentChat.messages,
  finalUserMessage,
];

updateCurrentMessages(updatedMessages);

updateCurrentMessages(updatedMessages);
    
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
  setIsTyping(false);
setIsGenerating(false);

    } catch (error) {
      console.error(error);

      setIsTyping(false);
setIsGenerating(false);
     updateCurrentMessages([
  ...currentChat.messages,
  userMessage,
  {
    id: Date.now() + 1,
    sender: "ai",
    message: "❌ Unable to connect to the backend.",
  },
]);
    }
  };
const handleRegenerate = async () => {
    speechSynthesis.cancel();
   stopGenerationRef.current = false;
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
const handleStopGenerating = () => {
  stopGenerationRef.current = true;
  setIsGenerating(false);
  setIsTyping(false);
};
  const handleNewChat = () => {
    const newChat = createNewChat();

    setChats((prev) => [newChat, ...prev]);

    setCurrentChatId(newChat.id);
  };

return (
  <div className="flex h-[calc(100vh-140px)] overflow-hidden">

    {sidebarOpen && (
      <ChatSidebar
        chats={chats.filter((chat) =>
          chat.title.toLowerCase().includes(searchQuery.toLowerCase())
        )}
        currentChatId={currentChatId}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onNewChat={handleNewChat}
        onSelectChat={setCurrentChatId}
        onDeleteChat={handleDeleteChat}
        onRenameChat={handleRenameChat}
      />
    )}

    <div className="flex min-h-0 flex-1 flex-col">

      {/* Header */}
      <div className="flex items-center gap-4 border-b border-slate-800 bg-slate-950 px-6 py-4">

        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="rounded-lg p-2 transition hover:bg-slate-800"
        >
          <Menu size={24} className="text-white" />
        </button>

        <div>
          <h1 className="text-3xl font-bold text-white">
            Astra AI
          </h1>

          <p className="text-slate-400">
            Your intelligent AI assistant
          </p>
        </div>

      </div>

      {/* Chat */}
<div className="flex min-h-0 flex-1 flex-col gap-4 p-6">

        <ChatContainer
          messages={currentChat.messages}
          isTyping={isTyping}
          isGenerating={isGenerating}
          onStopGenerating={handleStopGenerating}
          onRegenerate={handleRegenerate}
          onExport={() => setExportOpen(true)}
        />

        <ChatInput onSend={handleSendMessage} />

      </div>

    </div>
<ExportModal
  open={exportOpen}
  selectedFormat={selectedFormat}
  setSelectedFormat={setSelectedFormat}
  onClose={() => setExportOpen(false)}
  onExport={handleExportChat}
/>
  </div>
);
}

export default Chat;
