import toast from "react-hot-toast";

function useChatManagement({
  chats,
  setChats,
  currentChatId,
  setCurrentChatId,
  createNewChat,
}){
// =========================
  // Chat Functions
  // =========================

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

  // Select Chat
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

  // =========================
  // Chat Functions
  // =========================

  // Delete Chat
  const handleDeleteChat = (chatId) => {
    if (chats.length === 1) {
      toast.error("At least one chat must remain.");
      return;
    }

  const settings =
    JSON.parse(localStorage.getItem("astra-settings")) || {};
    if (
  (settings.deleteConfirmation ?? true) &&
  !window.confirm(
    "Are you sure you want to delete this chat?"
  )
) {
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