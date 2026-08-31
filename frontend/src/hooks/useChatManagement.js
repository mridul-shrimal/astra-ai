import toast from "react-hot-toast";
import api from "../services/api";
import { createConversationApi } from "@astra/shared";
const conversationApi = createConversationApi(api);
function useChatManagement({
  chats,
  backendConversations,
  setBackendConversations,
  setChats,
  currentChatId,
  setCurrentChatId,
  createNewChat,
}){
// =========================
  // Chat Functions
  // =========================

const handleRenameChat = async (chatId) => {
  // Find chat in frontend state first
  let chat = chats.find(
    (c) =>
      c.id === chatId ||
      c.sessionId === chatId
  );

  // If not found, look in backend conversations
  const backendChat =
    backendConversations?.find(
      (conversation) =>
        conversation.session_id === chatId
    );

  // Build a usable chat object
  if (!chat && backendChat) {
    chat = {
      id: backendChat.session_id,
      sessionId: backendChat.session_id,
      title: backendChat.title,
    };
  }

  if (!chat) {
    console.error(
      "❌ Rename failed: Chat not found",
      {
        chatId,
        chats,
        backendConversations,
      }
    );

    toast.error("Chat not found.");
    return;
  }

  const sessionId =
    chat.sessionId || chat.id;

  if (!sessionId) {
    toast.error(
      "Unable to rename this chat."
    );
    return;
  }

  const newTitle = window.prompt(
    "Rename chat",
    chat.title || ""
  );

  if (!newTitle || !newTitle.trim()) {
    return;
  }

  const title = newTitle.trim();

  try {
    const response = await conversationApi.updateConversation(
  sessionId,
  {
    title,
  }
);

    const data = response.data;

    if (!data.success) {
      throw new Error(
        data.message ||
          "Failed to rename conversation"
      );
    }

    // Update frontend chats
    setChats((prev) =>
      prev.map((item) =>
        item.id === chatId ||
        item.sessionId === chatId ||
        item.sessionId === sessionId
          ? {
              ...item,
              title,
            }
          : item
      )
    );

    // Update backend conversation state
    setBackendConversations((prev) =>
      prev.map((conversation) =>
        conversation.session_id === sessionId
          ? {
              ...conversation,
              title,
            }
          : conversation
      )
    );

    toast.success("Chat renamed!");
  } catch (error) {
    console.error(
      "❌ Rename Conversation Error:",
      error
    );

    toast.error(
      error.response?.data?.message ||
        error.message ||
        "Failed to rename chat."
    );
  }
};

  const handlePinChat = (chatId) => {
    

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

  // =========================
  // Chat Functions
  // =========================

  // Duplicate Chat
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

  // Archive / Restore Chat
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
        (chat) =>
          chat.id !== chatId &&
          !chat.archived
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

  // Lock / Unlock Chat
  const handleToggleLock = (chatId) => {
    const chat = chats.find((c) => c.id === chatId);

    if (!chat) return;

    // Remove lock (requires PIN)
    if (chat.locked) {
      const pin = prompt(
        "🔑 Enter PIN to remove the lock:"
      );

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
      // Create Lock
    const pin = prompt(
      "Enter a 4-digit PIN to lock this chat:"
    );

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
  const chat = chats.find(
    (c) => c.id === chatId || c.sessionId === chatId
  );

  if (chat) {
    if (!chat.locked) {
      setCurrentChatId(chat.id);
      return;
    }

    // PIN logic...
  }

  const backendChat = backendConversations.find(
    (conversation) => conversation.session_id === chatId
  );

  if (!backendChat) return;

  setCurrentChatId(backendChat.session_id);
};
  // =========================
  // Chat Functions
  // =========================

const handleDeleteChat = async (chatId) => {
 

  const chat = chats.find(
    (chat) => chat.id === chatId
  );

  const backendChat = backendConversations?.find(
    (conversation) =>
      conversation.session_id === chatId
  );



  // At least one chat must remain
  const totalChats =
    chats.length +
    (backendConversations?.filter(
      (conversation) =>
        !chats.some(
          (chat) =>
            chat.sessionId ===
            conversation.session_id
        )
    ).length || 0);

  if (totalChats <= 1) {
    toast.error(
      "At least one chat must remain."
    );
    return;
  }

  const settings =
    JSON.parse(
      localStorage.getItem("astra-settings")
    ) || {};

  if (
    (settings.deleteConfirmation ?? true) &&
    !window.confirm(
      "Are you sure you want to delete this chat?"
    )
  ) {
    return;
  }

  try {
    // =========================
    // Backend Conversation
    // =========================

if (backendChat) {
  

 const response = await conversationApi.deleteConversation(
  backendChat.session_id
);

const data = response.data;

  

  if (!data.success) {
    throw new Error(
      data.message ||
        "Failed to delete conversation"
    );
  }

  // Remove deleted conversation from backend state
  const remainingBackendChats =
    backendConversations.filter(
      (conversation) =>
        conversation.session_id !==
        backendChat.session_id
    );

  setBackendConversations(
    remainingBackendChats
  );

  // Remove deleted chat from frontend state
  const remainingFrontendChats =
    chats.filter(
      (chat) =>
        chat.sessionId !==
        backendChat.session_id
    );

  setChats(remainingFrontendChats);

  // Select another available chat
  const nextChat =
    remainingFrontendChats[0] ||
    remainingBackendChats[0];

  if (nextChat) {
    setCurrentChatId(
      nextChat.id ||
        nextChat.session_id ||
        nextChat.sessionId
    );
  } else {
    setCurrentChatId(null);
  }

  toast.success("Chat deleted!");

  return;
}

    // =========================
    // Frontend-only Chat
    // =========================

    if (chat) {
      const updatedChats = chats.filter(
        (chat) => chat.id !== chatId
      );

      setChats(updatedChats);

      if (currentChatId === chatId) {
        setCurrentChatId(
          updatedChats[0]?.id || null
        );
      }

      toast.success("Chat deleted!");
    }
  } catch (error) {
    console.error(
      "❌ Delete Conversation Error:",
      error
    );

    toast.error(
      "Failed to delete chat."
    );
  }
};
  return {
  handleRenameChat,
  handlePinChat,
  handleDuplicateChat,
  handleArchiveChat,
  handleToggleLock,
  handleSelectChat,
  handleDeleteChat,
};
}

export default useChatManagement;