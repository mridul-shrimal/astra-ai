import { useRef, useState } from "react";
import toast from "react-hot-toast";
import ChatDesktop from "../components/chat/ChatDesktop";
import api from "../services/api";
import { createConversationApi } from "@astra/shared";
import notificationSound from "../assets/sounds/notification.mp3";
import useExportChat from "../hooks/useChatExport";
import useChatStream from "../hooks/useChatStream";
import useChatManagement from "../hooks/useChatManagement";
import useChatEffects from "../hooks/useChatEffects";
import useChatPersistence from "../hooks/useChatPersistence";
import { generateChatTitle } from "../utils/generateChatTitle";
import ModelSelectorModal from "../components/chat/ModelSelectorModal";
import useMessageActions from "../hooks/useMessageActions";
import { useAuth } from "../hooks/useAuth";
import { speak } from "../utils/speech";
import { useEffect } from "react";

const conversationApi = createConversationApi(api);
// =========================
// Helper Functions
// =========================

const createNewChat = (selectedModel) => {
  const now = Date.now();

  return {
    id: crypto.randomUUID(),
    sessionId: crypto.randomUUID(),
      timestamp: now,
    title: "New Chat",
    pinned: false,
    archived: false,
    folder: "Uncategorized",
    tags: [],
    locked: false,
    lockPin: "",
    model: selectedModel,
   messages: [],
  };
};

function Chat() {
  // =========================
  // Backend Conversations
  // =========================

  const [
    backendConversations,
    setBackendConversations,
  ] = useState([]);

  // =========================
  // Load Backend Conversations
  // =========================

  useEffect(() => {
    const loadConversations = async () => {
      try {
       const response = await conversationApi.getConversations();

      const data = response.data;

        setBackendConversations(
          data.success ? data.conversations : []
        );
      } catch (error) {
        console.error(
          "❌ Failed to load conversations:",
          error
        );
      }
    };

    loadConversations();
  }, []);


  // =========================
  // UI State
  // =========================

  const [statsOpen, setStatsOpen] = useState(false);
  const [favoritesOpen, setFavoritesOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(
    window.innerWidth >= 768
  );
  const toggleSidebar = () => {
  setSidebarOpen((prev) => !prev);
};

  const [modelModalOpen, setModelModalOpen] = useState(false);
  const [exportOpen, setExportOpen] = useState(false);

  // =========================
  // Chat State
  // =========================

  const [selectedModel, setSelectedModel] = useState("⭐ Mistral Small 3.2 (Recommended)");
  const [selectedFormat, setSelectedFormat] = useState(() => {
  const settings =
    JSON.parse(localStorage.getItem("astra-settings")) || {};

  return settings.exportFormat || "pdf";
});
  const [selectedTag, setSelectedTag] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
const searchRef = useRef(null);
const [backendMessages] = useState([]);

  // =========================
  // Authentication
  // =========================

  const { user } = useAuth();

  const fullName =
    user?.user_metadata?.full_name ||
    user?.full_name ||
    "User";

  const firstName = fullName.trim().split(" ")[0];

  // =========================
  // Folder & Tag State
  // =========================

  const [folders, setFolders] = useState(() => {
    const saved = localStorage.getItem("astra-folders");

    return saved
      ? JSON.parse(saved)
      : ["Uncategorized"];
  });

  const [tags, setTags] = useState(() => {
    const saved = localStorage.getItem("astra-tags");

    return saved
      ? JSON.parse(saved)
      : [];
  });

  // =========================
  // Chat Data
  // =========================

  const [chats, setChats] = useState([]);

const [currentChatId, setCurrentChatId] = useState(null);

const currentChat =
  chats.find(
    (chat) =>
      chat.id === currentChatId ||
      chat.sessionId === currentChatId
  ) ||
  backendConversations
    ?.map((conversation) => ({
      id: conversation.session_id,
      sessionId: conversation.session_id,
      title: conversation.title,
      timestamp: new Date(
        conversation.created_at
      ).getTime(),
      pinned: false,
      archived: false,
      folder: "Uncategorized",
      tags: [],
      locked: false,
      lockPin: "",
      model: null,
      messages:
        backendMessages[conversation.session_id] || [],
      backendId: conversation.id,
    }))
    .find(
      (chat) =>
        chat.id === currentChatId ||
        chat.sessionId === currentChatId
    ) ||
  null;


useEffect(() => {
  if (!currentChatId) return;

  const loadMessages = async () => {
    try {
        const response = await conversationApi.getConversationMessages(
  currentChatId
);

      const data = response.data;

      if (!data.success) return;

      const messages = data.messages.map((msg) => ({
        id: msg.id,
        sender: msg.sender,
        message: msg.content,
        timestamp: new Date(
          msg.created_at
        ).getTime(),
      }));

      setChats((prev) => {
        const existingChat = prev.find(
          (chat) =>
            chat.id === currentChatId ||
            chat.sessionId === currentChatId
        );

        // Backend chat is already inside chats
        if (existingChat) {
          return prev.map((chat) =>
            chat.id === currentChatId ||
            chat.sessionId === currentChatId
              ? {
                  ...chat,
                  messages,
                }
              : chat
          );
        }

        // Backend chat isn't inside chats yet
        const backendConversation =
          backendConversations.find(
            (conversation) =>
              conversation.session_id ===
              currentChatId
          );

        if (!backendConversation) {
          return prev;
        }

        const backendChat = {
          id: backendConversation.session_id,
          sessionId:
            backendConversation.session_id,
          timestamp: new Date(
            backendConversation.created_at
          ).getTime(),
          title: backendConversation.title,
          pinned: false,
          archived: false,
          folder: "Uncategorized",
          tags: [],
          locked: false,
          lockPin: "",
          model: null,
          messages,
          backendId: backendConversation.id,
        };

        return [...prev, backendChat];
      });
    } catch (error) {
      console.error(
        "❌ Failed to load messages:",
        error
      );
    }
  };

  loadMessages();
}, [
  currentChatId,
  backendConversations,
]);

useEffect(() => {
  if (
    !currentChatId &&
    backendConversations.length > 0
  ) {
    setCurrentChatId(
      backendConversations[0].session_id
    );
  }
}, [backendConversations, currentChatId]);

const {
  updateCurrentMessages,
  handleFeedback,
  handleFavoriteMessage,
} = useMessageActions({
  currentChat,
  currentChatId,
  setChats,
});
const {
  handleRenameChat,
  handlePinChat,
  handleDuplicateChat,
  handleArchiveChat,
  handleToggleLock,
  handleSelectChat,
  handleDeleteChat,
} = useChatManagement({
  chats,
  backendConversations,
  setBackendConversations,
  setChats,
  currentChatId,
  setCurrentChatId,
  createNewChat,
});

const { handleExportChat } = useExportChat({
  currentChat,
  selectedFormat,
  setExportOpen,
});

  // =========================
  // Generation State
  // =========================

  const [isTyping, setIsTyping] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  // =========================
  // Refs
  // =========================

  const stopGenerationRef = useRef(false);

// Hooks

  const {
  streamMessage,
} = useChatStream({
  updateCurrentMessages,
  stopGenerationRef,
  setIsTyping,
  setIsGenerating,
});

useChatEffects({
  chats,
  currentChat,
  currentChatId,
  folders,
  tags,
  setSidebarOpen,
  setCurrentChatId,
  setSelectedModel,
});

useChatPersistence({
  folders,
  tags,
});


  // =========================
  // Model Functions
  // =========================

  const handleModelChange = (model) => {
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

  // =========================
  // Message Functions
  // =========================

  const handleSendMessage = async (
    text,
    files
  ) => {
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
  const newTitle = text.trim()
    ? generateChatTitle(text)
    : files.length
    ? files[0].name
    : "New Chat";

  setChats((prev) =>
    prev.map((chat) =>
      chat.id === currentChat.id
        ? {
            ...chat,
            title: newTitle,
          }
        : chat
    )
  );
}

    // =========================
    // Start Generation
    // =========================

    stopGenerationRef.current = false;

    setIsTyping(true);
    setIsGenerating(true);

    try {
      // =========================
      // Build Request
      // =========================

      const formData = new FormData();

      const prompt =
        text.trim() ||
        `Analyze the uploaded document(s) and provide:
- A concise summary
- Key points
- Important information
- Any actionable insights`;

      formData.append("message", prompt);
      formData.append(
        "sessionId",
        currentChat.sessionId
      );
const settings =
  JSON.parse(localStorage.getItem("astra-settings")) || {};


const MODEL_MAP = {
  "Mistral Small 3.2":
    "mistralai/mistral-small-3.2-24b-instruct",

  "Gemma 3 27B":
    "google/gemma-3-27b-it",

  "DeepSeek Chat V3":
    "deepseek/deepseek-chat",

  "GPT OSS 20B":
    "openai/gpt-oss-20b",
};
const activeModel =
  currentChat?.model ||
  "⭐ Mistral Small 3.2 (Recommended)";



formData.append(
  "model",
  MODEL_MAP[activeModel] ||
    "mistralai/mistral-small-3.2-24b-instruct"
);

formData.append(
  "temperature",
  settings.temperature ?? 0.7
);
formData.append(
  "useMemory",
  settings.memoryEnabled ?? true
);
formData.append(
  "autoSaveMemory",
  settings.memoryAutoSave ?? true
);

      files.forEach((file) => {
        formData.append("files", file);
      });

      // =========================
      // Show User Message
      // =========================

      updateCurrentMessages([
        ...currentChat.messages,
        userMessage,
      ]);

      const response = await api.post(
  "/chat",
  formData
);

const data = response.data;

if (data.success === false) {
  const backendError =
    data.reply ||
    "❌ Astra could not process your request.";

  throw new Error(backendError);
}
// Model fallback toast will be handled
// from the final streaming event.

      // =========================
      // Update Uploaded Files
      // =========================

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

      const updatedMessages = [
        ...currentChat.messages,
        finalUserMessage,
      ];

      updateCurrentMessages(updatedMessages);

      // =========================
      // Create AI Message
      // =========================

      const aiId = Date.now() + 1;

      const aiMessage = {
        id: aiId,
        sender: "ai",
        message: "",
        timestamp: Date.now(),
        liked: false,
        disliked: false,
        favourite: false,
      };

      const newMessages = [
        ...updatedMessages,
        aiMessage,
      ];

      updateCurrentMessages(newMessages);

      // =========================
      // Stream Response
      // =========================

    await streamMessage(
  currentChat.sessionId,
  aiId,
  newMessages,
  formData
);

if (
  data.modelUsed &&
  data.modelUsed !== settings.model
) {
  toast(
    `⚠️ ${settings.model} was busy. Astra used ${data.modelUsed} instead.`,
    {
      icon: "🤖",
    }
  );
}

// Desktop Notification
if (
  settings.desktopNotification &&
  Notification.permission === "granted"
) {
  new Notification("Astra AI", {
    body: "Your response is ready.",
  });
}

// Notification Sound
if (settings.notificationSound) {
  const audio = new Audio(notificationSound);
  audio.volume = 0.5;
  audio.play().catch(() => {});
}

setIsTyping(false);
setIsGenerating(false);
      // =========================
      // Auto Read Aloud
      // =========================

      if (settings.autoRead) {
  speak(data.reply);
}
    } catch (error) {
  console.error("❌ Chat Error:", error);

  setIsTyping(false);
  setIsGenerating(false);

  let errorMessage =
    "❌ Something went wrong. Please try again.";

  if (error?.message) {
    errorMessage = `❌ ${error.message}`;
  }

  toast.error(errorMessage);

  updateCurrentMessages([
    ...currentChat.messages,
    userMessage,
    {
      id: Date.now() + 1,
      sender: "ai",
      message: errorMessage,
      timestamp: Date.now(),
      liked: false,
      disliked: false,
    },
  ]);
}
  };

  // =========================
  // Message Functions
  // =========================

  const handleRegenerate = async (aiMessageId) => {
    speechSynthesis.cancel();
    stopGenerationRef.current = false;

    // Find the AI message
    const aiIndex = currentChat.messages.findIndex(
      (msg) => msg.id === aiMessageId
    );

    if (aiIndex === -1) return;

    // Find the user message before this AI response
    let userMessage = null;

    for (let i = aiIndex - 1; i >= 0; i--) {
      if (currentChat.messages[i].sender === "user") {
        userMessage = currentChat.messages[i];
        break;
      }
    }

    if (!userMessage) return;

    // Preserve current messages
    const updatedMessages = [...currentChat.messages];

    updateCurrentMessages(updatedMessages);

    setIsTyping(true);

    try {
      // Request regenerated response
     const response = await api.post(
  "/chat",
  {
    message: userMessage.message,
    sessionId: currentChat.sessionId,
  }
);

const data = response.data;

    
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
          msg.id === aiMessageId
            ? aiMessage
            : msg
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
                message:
                  "❌ Failed to regenerate response.",
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

  // =========================
  // Chat Functions
  // =========================
const MODEL_LABEL_MAP = {
  "mistralai/mistral-small-3.2-24b-instruct":
    "⭐ Mistral Small 3.2 (Recommended)",

  "google/gemma-3-27b-it":
    "Gemma 3 27B",

  "deepseek/deepseek-chat-v3":
    "DeepSeek Chat V3",

  "openai/gpt-oss-20b":
    "GPT OSS 20B",
};

const handleNewChat = () => {
  const settings =
    JSON.parse(localStorage.getItem("astra-settings")) || {};

  setSelectedModel(
    MODEL_LABEL_MAP[settings.model] ||
      "⭐ Mistral Small 3.2 (Recommended)"
  );

  setModelModalOpen(true);
};

const handleCreateChatWithModel = async () => {
  try {
    const response = await conversationApi.createConversation();

    const data = response.data;

    if (!data.success) {
      throw new Error(
        data.message || "Failed to create conversation"
      );
    }

    const newChat = createNewChat(
      selectedModel,
      firstName
    );

    // Use the backend session ID
    newChat.sessionId =
      data.conversation.session_id;

    newChat.title =
      data.conversation.title || "New Chat";

    setChats((prev) => [newChat, ...prev]);

    setCurrentChatId(
      data.conversation.session_id
    );

    setModelModalOpen(false);

    toast.success("New chat created!");
  } catch (error) {
    console.error(
      "❌ Create Conversation Error:",
      error
    );

    toast.error(
      error.response?.data?.message ||
        error.message ||
        "Failed to create new chat."
    );
  }
};

  // =========================
  // Folder Functions
  // =========================

  const handleCreateFolder = () => {
    const name = prompt("Enter folder name:");

    if (!name?.trim()) return;

    if (folders.includes(name.trim())) {
      toast.error("Folder already exists!");
      return;
    }

    setFolders((prev) => [
      ...prev,
      name.trim(),
    ]);

    toast.success("📂 Folder created!");
  };

  // =========================
  // Folder Functions
  // =========================

  const handleDeleteFolder = (folderName) => {
    if (
      !window.confirm(
        `Delete "${folderName}" folder?`
      )
    ) {
      return;
    }

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

  const handleRenameFolder = (oldName) => {
    const newName = prompt(
      "Enter new folder name:",
      oldName
    );

    if (!newName) return;

    const trimmedName = newName.trim();

    if (
      !trimmedName ||
      trimmedName === oldName
    ) {
      return;
    }

    if (folders.includes(trimmedName)) {
      toast.error("Folder already exists.");
      return;
    }

    setFolders((prev) =>
      prev.map((folder) =>
        folder === oldName
          ? trimmedName
          : folder
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

  const handleMoveChatToFolder = (
    chatId,
    folderName
  ) => {
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

  // =========================
  // Tag Functions
  // =========================

  const handleCreateTag = () => {
    const tagName = prompt("Enter tag name:");

    if (!tagName) return;

    const trimmedTag = tagName.trim();

    if (!trimmedTag) return;

    if (tags.includes(trimmedTag)) {
      toast.error("Tag already exists.");
      return;
    }

    setTags((prev) => [
      ...prev,
      trimmedTag,
    ]);

    toast.success("🏷️ Tag created!");
  };

  const handleToggleTag = (
    chatId,
    tag
  ) => {
    setChats((prev) =>
      prev.map((chat) => {
        if (chat.id !== chatId) return chat;

        const hasTag =
          chat.tags.includes(tag);

        return {
          ...chat,
          tags: hasTag
            ? chat.tags.filter(
                (t) => t !== tag
              )
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
    ) {
      return;
    }

    // Remove from global tags
    setTags((prev) =>
      prev.filter(
        (tag) => tag !== tagName
      )
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
          tag.toLowerCase() ===
            trimmedTag.toLowerCase() &&
          tag !== oldTag
      )
    ) {
      toast.error("Tag already exists!");
      return;
    }

    // Update global tags
    setTags((prev) =>
      prev.map((tag) =>
        tag === oldTag
          ? trimmedTag
          : tag
      )
    );

    // Update every chat
    setChats((prev) =>
      prev.map((chat) => ({
        ...chat,
        tags: chat.tags.map((tag) =>
          tag === oldTag
            ? trimmedTag
            : tag
        ),
      }))
    );

    toast.success("🏷️ Tag renamed!");
  };

  // =========================
  // Development Test
  // =========================

  <button
    onClick={() => {
      speak("Hello from Astra AI");
    }}
    className="rounded-xl bg-cyan-500 px-4 py-2 text-white"
  >
    Test Auto Read Aloud
  </button>
  // =========================
  // Render
  // =========================

  return (
    <>
      <ChatDesktop
        // =========================
        // Chat Data
        // =========================
        chats={chats}
        backendConversations={backendConversations}
        folders={folders}
        tags={tags}

        currentChat={currentChat}
        currentChatId={currentChatId}

        // =========================
        // Sidebar
        // =========================
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
onToggleSidebar={toggleSidebar}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
searchRef={searchRef}
        selectedTag={selectedTag}
        setSelectedTag={setSelectedTag}

        // =========================
        // Export
        // =========================
        exportOpen={exportOpen}
        setExportOpen={setExportOpen}

        selectedFormat={selectedFormat}
        setSelectedFormat={setSelectedFormat}

        // =========================
        // Status
        // =========================
        isTyping={isTyping}
        isGenerating={isGenerating}

        selectedModel={selectedModel}
        setSelectedModel={setSelectedModel}

        // =========================
        // Statistics
        // =========================
        statsOpen={statsOpen}
        onOpenStats={() => setStatsOpen(true)}
        onCloseStats={() => setStatsOpen(false)}

        favoritesOpen={favoritesOpen}
        onOpenFavorites={() => setFavoritesOpen(true)}
        onCloseFavorites={() => setFavoritesOpen(false)}

        // =========================
        // Chat Actions
        // =========================
        handleNewChat={handleNewChat}
        handleDeleteChat={handleDeleteChat}
        handleRenameChat={handleRenameChat}
        handleDuplicateChat={handleDuplicateChat}
        handleArchiveChat={handleArchiveChat}
        handlePinChat={handlePinChat}
        setCurrentChatId={handleSelectChat}

        // =========================
        // Folder Actions
        // =========================
        handleCreateFolder={handleCreateFolder}
        handleDeleteFolder={handleDeleteFolder}
        handleRenameFolder={handleRenameFolder}
        handleMoveChatToFolder={
          handleMoveChatToFolder
        }

        // =========================
        // Tag Actions
        // =========================
        handleCreateTag={handleCreateTag}
        onToggleTag={handleToggleTag}
        onDeleteTag={handleDeleteTag}
        onRenameTag={handleRenameTag}

        // =========================
        // Model
        // =========================
        handleModelChange={handleModelChange}

        // =========================
        // Security
        // =========================
        onToggleLock={handleToggleLock}

        // =========================
        // Messages
        // =========================
        handleSendMessage={handleSendMessage}
        handleStopGenerating={
          handleStopGenerating
        }
        handleRegenerate={handleRegenerate}
        handleFeedback={handleFeedback}
        handleFavoriteMessage={
          handleFavoriteMessage
        }

        // =========================
        // Export
        // =========================
        handleExportChat={handleExportChat}
      />


      <ModelSelectorModal
        open={modelModalOpen}
        selectedModel={selectedModel}
        setSelectedModel={setSelectedModel}
        onCancel={() =>
          setModelModalOpen(false)
        }
        onCreate={handleCreateChatWithModel}
      />
    </>
  );
}

export default Chat;