import { useEffect, useRef, useState } from "react";
import { jsPDF } from "jspdf";
import toast from "react-hot-toast";
import ChatDesktop from "../components/chat/ChatDesktop";
import ModelSelectorModal from "../components/chat/ModelSelectorModal";
import { useAuth } from "../hooks/useAuth";

const createNewChat = (selectedModel, firstName) => {
  const now = Date.now();

  return {
    id: crypto.randomUUID(),
    sessionId: crypto.randomUUID(),
    title: "New Chat",
    pinned: false,
    archived: false,
    folder: "Uncategorized",
    tags: [],
    locked: false,
    lockPin: "",
    model: selectedModel,
    messages: [
      {
        id: crypto.randomUUID(),
        sender: "ai",
        message: `Hello ${firstName} 👋 I'm Astra. How can I help you today?`,
        timestamp: now,
        favorite: false,
      },
    ],
  };
};

function Chat() {

const [statsOpen, setStatsOpen] = useState(false);
const [selectedTag, setSelectedTag] = useState("All");
const [modelModalOpen, setModelModalOpen] = useState(false);
const [selectedModel, setSelectedModel] = useState("GPT-4o");
const [favoritesOpen, setFavoritesOpen] = useState(false);
const [folders, setFolders] = useState(() => {
  const saved = localStorage.getItem("astra-folders");
  

  return saved
    ? JSON.parse(saved)
    : ["Uncategorized"];
});
const { user } = useAuth();

const fullName =
  user?.user_metadata?.full_name ||
  user?.full_name ||
  "User";

const firstName = fullName.trim().split(" ")[0];

const [tags, setTags] = useState(() => {
  const saved = localStorage.getItem("astra-tags");

  return saved
    ? JSON.parse(saved)
    : [];
});

  // Load chats
  const [chats, setChats] = useState(() => {
  const saved = localStorage.getItem("astra-chats");

  if (saved) {
    return JSON.parse(saved).map((chat) => ({
  pinned: false,
  archived: false,
  folder: "Uncategorized",
  tags: [],
  locked: false,
lockPin: "",
  ...chat,
}));
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
const [sidebarOpen, setSidebarOpen] = useState(
  window.innerWidth >= 768
);
useEffect(() => {
  const handleResize = () => {
    if (window.innerWidth < 768) {
      setSidebarOpen(false);
    } else {
      setSidebarOpen(true);
    }
  };

  handleResize();

  window.addEventListener("resize", handleResize);

  return () => {
    window.removeEventListener("resize", handleResize);
  };
}, []);
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

  // Save folders
useEffect(() => {
  localStorage.setItem(
    "astra-folders",
    JSON.stringify(folders)
  );
}, [folders]);

// Save tags
useEffect(() => {
  localStorage.setItem(
    "astra-tags",
    JSON.stringify(tags)
  );
}, [tags]);

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

useEffect(() => {
  if (!currentChat) return;

  setSelectedModel(currentChat.model || "GPT-4o");
}, [currentChat]);

const handleFeedback = (messageId, type) => {
  const updatedMessages = currentChat.messages.map((msg) => {
    if (msg.id !== messageId) return msg;

    if (type === "like") {
      return {
        ...msg,
        liked: !msg.liked,
        disliked: false,
      };
  
    }

    return {
      ...msg,
      disliked: !msg.disliked,
      liked: false,
    };
  });

  updateCurrentMessages(updatedMessages);
};
// Toggle Favorite Message
const handleFavoriteMessage = (messageId) => {
  setChats((prev) =>
    prev.map((chat) =>
      chat.id !== currentChatId
        ? chat
        : {
            ...chat,
            messages: chat.messages.map((msg) =>
              msg.id === messageId
                ? {
                    ...msg,
                    favorite: !msg.favorite,
                  }
                : msg
            ),
          }
    )
  );

  toast.success("⭐ Favorites updated!");
};

const handleModelChange = (model) => {
  setSelectedModel(model);

  setChats((prev) =>
    prev.map((chat) =>
      chat.id === currentChatId
        ? {
            ...chat,
            model,
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
  toast.success("Chat renamed!");
};
const handlePinChat = (chatId) => {
   console.log("PIN CLICKED:", chatId);

  setChats((prev) =>
    prev.map((chat) =>
      chat.id === chatId
        ? {
            ...chat,
            pinned: !chat.pinned,
          }
        : chat
    )
  );

  toast.success("Chat updated!");
};
//Chat Duplicate
const handleDuplicateChat = (chatId) => {
  const chat = chats.find((c) => c.id === chatId);

  if (!chat) return;

  // Remove any existing "(Copy)" or "(Copy X)"
  const baseTitle = chat.title.replace(
    /\s\(Copy(?: \d+)?\)$/i,
    ""
  );

  // Find the next available copy number
  let copyNumber = 1;
  let newTitle = `${baseTitle} (Copy)`;

  while (
    chats.some(
      (c) =>
        c.title.toLowerCase() ===
        newTitle.toLowerCase()
    )
  ) {
    copyNumber++;
    newTitle = `${baseTitle} (Copy ${copyNumber})`;
  }

  const duplicatedChat = {
    ...chat,
    id: crypto.randomUUID(),
    sessionId: crypto.randomUUID(),
    title: newTitle,
    pinned: false,
    archived: false,
    locked: false,
  lockPin: "",
    messages: chat.messages.map((msg) => ({
      ...msg,
      id: crypto.randomUUID(),
    })),
  };

  setChats((prev) => [duplicatedChat, ...prev]);

  setCurrentChatId(duplicatedChat.id);

  toast.success("📑 Chat duplicated successfully!");
};
// Archive Chat
const handleArchiveChat = (chatId) => {
  const chat = chats.find((c) => c.id === chatId);

  setChats((prev) =>
    prev.map((chat) =>
      chat.id === chatId
        ? {
            ...chat,
            archived: !chat.archived,
          }
        : chat
    )
  );

  // If the current chat was archived, switch to another active chat
  if (currentChatId === chatId && !chat?.archived) {
    const nextChat = chats.find(
      (chat) => chat.id !== chatId && !chat.archived
    );

    if (nextChat) {
      setCurrentChatId(nextChat.id);
    } else {
      const newChat = createNewChat();

      setChats((prev) => [newChat, ...prev]);

      setCurrentChatId(newChat.id);
    }
  }

  toast.success(
    chat?.archived
      ? "🔄 Chat restored!"
      : "📦 Chat archived!"
  );
};
const handleToggleLock = (chatId) => {
  const chat = chats.find((c) => c.id === chatId);

  if (!chat) return;

  // Remove lock (requires PIN)
if (chat.locked) {
  const pin = prompt("🔑 Enter PIN to remove the lock:");

  if (pin === null) return;

  if (pin !== chat.lockPin) {
    toast.error("❌ Incorrect PIN");
    return;
  }

  setChats((prev) =>
    prev.map((c) =>
      c.id === chatId
        ? {
            ...c,
            locked: false,
            lockPin: "",
          }
        : c
    )
  );

  toast.success("🔓 Lock removed");
  return;
}
  // Lock
  const pin = prompt("Enter a 4-digit PIN to lock this chat:");

  if (!pin) return;

  if (!/^\d{4}$/.test(pin)) {
    toast.error("PIN must be exactly 4 digits.");
    return;
  }

  setChats((prev) =>
    prev.map((c) =>
      c.id === chatId
        ? {
            ...c,
            locked: true,
            lockPin: pin,
          }
        : c
    )
  );

  toast.success("🔒 Chat locked");
};
const handleSelectChat = (chatId) => {
  const chat = chats.find((c) => c.id === chatId);

  if (!chat) return;

  if (!chat.locked) {
    setCurrentChatId(chatId);
    return;
  }

  const pin = prompt("🔒 Enter your PIN");

  if (pin === null) return;

  if (pin === chat.lockPin) {
    setCurrentChatId(chatId);
    toast.success("🔓 Chat unlocked");
  } else {
    toast.error("❌ Incorrect PIN");
  }
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

toast.success("Chat exported as PDF!");

return;
}

  // TXT (existing)
  if (selectedFormat === "txt") {
  downloadFile(
    plainText,
    `${currentChat.title || "chat"}.txt`,
    "text/plain;charset=utf-8"
  );
  toast.success("Chat exported as TXT!");
  return;
}

if (selectedFormat === "md") {
  downloadFile(
    markdown,
    `${currentChat.title || "chat"}.md`,
    "text/markdown;charset=utf-8"
  );
  toast.success("Chat exported as Markdown!");
  return;
}

if (selectedFormat === "html") {
  downloadFile(
    html,
    `${currentChat.title || "chat"}.html`,
    "text/html;charset=utf-8"
  );
  toast.success("Chat exported as HTML!");
  return;
}

if (selectedFormat === "json") {
  downloadFile(
    json,
    `${currentChat.title || "chat"}.json`,
    "application/json"
  );
  toast.success("Chat exported as JSON!");
  return;
}

  toast(`${selectedFormat.toUpperCase()} export coming next.`);
};
  // Delete Chat
  const handleDeleteChat = (chatId) => {
  if (chats.length === 1) {
  toast.error("At least one chat must remain.");
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
  toast.success("Chat deleted!");
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
  timestamp: Date.now(),
  favorite: false,

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
                title: text.trim()
  ? text.substring(0, 30)
  : files.length
    ? files[0].name
    : "New Chat",
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

const prompt =
  text.trim() ||
  `Analyze the uploaded document(s) and provide:
- A concise summary
- Key points
- Important information
- Any actionable insights`;

formData.append("message", prompt);
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
    
      const aiId = Date.now() + 1;

const aiMessage = {
  id: aiId,
  sender: "ai",
  message: "",
  timestamp: Date.now(),
  liked: false,
  disliked: false,
  favourite:false,
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
toast.error("Unable to connect to backend.");
      setIsTyping(false);
setIsGenerating(false);
     updateCurrentMessages([
  ...currentChat.messages,
  userMessage,
  {
  id: Date.now() + 1,
  sender: "ai",
  message: "❌ Unable to connect to the backend.",
  timestamp: Date.now(),
  liked: false,
  disliked: false,
}
]);
    }
  };
const handleRegenerate = async (aiMessageId) => {
    speechSynthesis.cancel();
   stopGenerationRef.current = false;
  // Find the AI message index
const aiIndex = currentChat.messages.findIndex(
  (msg) => msg.id === aiMessageId
);

if (aiIndex === -1) return;

// Find the user message just before this AI response
let userMessage = null;

for (let i = aiIndex - 1; i >= 0; i--) {
  if (currentChat.messages[i].sender === "user") {
    userMessage = currentChat.messages[i];
    break;
  }
}

if (!userMessage) return;

  // Keep all messages
let updatedMessages = [...currentChat.messages];

  updateCurrentMessages(updatedMessages);

  setIsTyping(true);

  try {
    const response = await fetch("http://localhost:5000/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: userMessage.message,
        sessionId: currentChat.sessionId,
      }),
    });

    const data = await response.json();

    setIsTyping(false);

   const aiMessage = {
  id: Date.now(),
  sender: "ai",
  message: data.reply,
  timestamp: Date.now(),
  liked: false,
  disliked: false,
};

    updateCurrentMessages(
  updatedMessages.map((msg) =>
    msg.id === aiMessageId ? aiMessage : msg
  )
);
  } catch (error) {
    console.error(error);

    setIsTyping(false);

   updateCurrentMessages(
  updatedMessages.map((msg) =>
    msg.id === aiMessageId
      ? {
          ...msg,
          message: "❌ Failed to regenerate response.",
        }
      : msg
  )
);
  }
};
const handleStopGenerating = () => {
  stopGenerationRef.current = true;
  setIsGenerating(false);
  setIsTyping(false);
};
  const handleNewChat = () => {
  setModelModalOpen(true);
};

  const handleCreateFolder = () => {
  const name = prompt("Enter folder name:");

  if (!name?.trim()) return;

  if (folders.includes(name.trim())) {
    toast.error("Folder already exists!");
    return;
  }

  setFolders((prev) => [...prev, name.trim()]);
  toast.success("📂 Folder created!");
};

const handleCreateChatWithModel = () => {
  const newChat = createNewChat(selectedModel, firstName)

  setChats((prev) => [newChat, ...prev]);
  setCurrentChatId(newChat.id);

  setModelModalOpen(false);

  toast.success("New chat created!");
};

const handleDeleteFolder = (folderName) => {
  if (
    !window.confirm(
      `Delete "${folderName}" folder?`
    )
  )
    return;

  setChats((prev) =>
    prev.map((chat) =>
      chat.folder === folderName
        ? {
            ...chat,
            folder: "Uncategorized",
          }
        : chat
    )
  );

  setFolders((prev) =>
    prev.filter((f) => f !== folderName)
  );

  toast.success("Folder deleted.");
};

const handleCreateTag = () => {
  const tagName = prompt("Enter tag name:");

  if (!tagName) return;

  const trimmedTag = tagName.trim();

  if (!trimmedTag) return;

  if (tags.includes(trimmedTag)) {
    toast.error("Tag already exists.");
    return;
  }

  setTags((prev) => [...prev, trimmedTag]);

  toast.success("🏷️ Tag created!");
};

const handleToggleTag = (chatId, tag) => {
  setChats((prev) =>
    prev.map((chat) => {
      if (chat.id !== chatId) return chat;

      const hasTag = chat.tags.includes(tag);

      return {
        ...chat,
        tags: hasTag
          ? chat.tags.filter((t) => t !== tag)
          : [...chat.tags, tag],
      };
    })
  );
};
const handleDeleteTag = (tagName) => {
  if (
    !window.confirm(
      `Delete "${tagName}" tag from Astra AI?`
    )
  )
    return;

  // Remove from global tags
  setTags((prev) =>
    prev.filter((tag) => tag !== tagName)
  );

  // Remove from every chat
  setChats((prev) =>
    prev.map((chat) => ({
      ...chat,
      tags: chat.tags.filter(
        (tag) => tag !== tagName
      ),
    }))
  );

  toast.success("🗑️ Tag deleted!");
};
const handleRenameTag = (oldTag) => {
  const newTag = window.prompt(
    "Enter new tag name:",
    oldTag
  );

  if (!newTag) return;

  const trimmedTag = newTag.trim();

  if (!trimmedTag) return;

  if (
    tags.some(
      (tag) =>
        tag.toLowerCase() === trimmedTag.toLowerCase() &&
        tag !== oldTag
    )
  ) {
    toast.error("Tag already exists!");
    return;
  }

  // Update global tags
  setTags((prev) =>
    prev.map((tag) =>
      tag === oldTag ? trimmedTag : tag
    )
  );

  // Update every chat
  setChats((prev) =>
    prev.map((chat) => ({
      ...chat,
      tags: chat.tags.map((tag) =>
        tag === oldTag ? trimmedTag : tag
      ),
    }))
  );

  toast.success("🏷️ Tag renamed!");
};
const handleRenameFolder = (oldName) => {
  const newName = prompt(
    "Enter new folder name:",
    oldName
  );

  if (!newName) return;

  const trimmedName = newName.trim();

  if (!trimmedName || trimmedName === oldName) return;

  if (folders.includes(trimmedName)) {
    toast.error("Folder already exists.");
    return;
  }

  setFolders((prev) =>
    prev.map((folder) =>
      folder === oldName ? trimmedName : folder
    )
  );

  setChats((prev) =>
    prev.map((chat) =>
      chat.folder === oldName
        ? {
            ...chat,
            folder: trimmedName,
          }
        : chat
    )
  );

  toast.success("Folder renamed.");
};
const handleMoveChatToFolder = (chatId, folderName) => {
  setChats((prev) =>
    prev.map((chat) =>
      chat.id === chatId
        ? {
            ...chat,
            folder: folderName,
          }
        : chat
    )
  );

  toast.success(`Moved to "${folderName}"`);
};
return (
  <>
    <ChatDesktop
      chats={chats}
      folders={folders}
      currentChat={currentChat}
      currentChatId={currentChatId}

      sidebarOpen={sidebarOpen}
      setSidebarOpen={setSidebarOpen}

      searchQuery={searchQuery}
      setSearchQuery={setSearchQuery}

      exportOpen={exportOpen}
      selectedFormat={selectedFormat}
      setSelectedFormat={setSelectedFormat}

      statsOpen={statsOpen}
      onOpenStats={() => setStatsOpen(true)}
      onCloseStats={() => setStatsOpen(false)}

      favoritesOpen={favoritesOpen}
      onOpenFavorites={() => setFavoritesOpen(true)}
      onCloseFavorites={() => setFavoritesOpen(false)}

      handleMoveChatToFolder={handleMoveChatToFolder}
      handleRenameFolder={handleRenameFolder}

      isTyping={isTyping}
      isGenerating={isGenerating}

      selectedModel={selectedModel}
      setSelectedModel={setSelectedModel}
      handleModelChange={handleModelChange}

      handleNewChat={handleNewChat}
      handleCreateFolder={handleCreateFolder}
      handleDeleteChat={handleDeleteChat}
      handleRenameChat={handleRenameChat}
      handleDeleteFolder={handleDeleteFolder}
      handleCreateTag={handleCreateTag}
      onToggleTag={handleToggleTag}
      tags={tags}
      onDeleteTag={handleDeleteTag}
      onRenameTag={handleRenameTag}
      onToggleLock={handleToggleLock}

      selectedTag={selectedTag}
      setSelectedTag={setSelectedTag}

      handlePinChat={handlePinChat}
      handleDuplicateChat={handleDuplicateChat}
      handleArchiveChat={handleArchiveChat}
      handleSendMessage={handleSendMessage}
      handleStopGenerating={handleStopGenerating}
      handleRegenerate={handleRegenerate}
      handleFeedback={handleFeedback}
      handleFavoriteMessage={handleFavoriteMessage}

      handleExportChat={handleExportChat}

      setCurrentChatId={handleSelectChat}
      setExportOpen={setExportOpen}
    />

    <ModelSelectorModal
      open={modelModalOpen}
      selectedModel={selectedModel}
      setSelectedModel={setSelectedModel}
      onCancel={() => setModelModalOpen(false)}
      onCreate={handleCreateChatWithModel}
    />
  </>
);
}
export default Chat;