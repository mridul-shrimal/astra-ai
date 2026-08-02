import { useEffect } from "react";

function useChatEffects({
  chats,
  currentChat,
  currentChatId,
  setSidebarOpen,
  setCurrentChatId,
  setSelectedModel,
}) {

// Select first chat
  useEffect(() => {
    if (!currentChatId && chats.length) {
      setCurrentChatId(chats[0].id);
    }
  }, [currentChatId, chats, setCurrentChatId]);

  // Sidebar responsiveness
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
  }, [setSidebarOpen]);

  // Sync selected model
  useEffect(() => {
    if (!currentChat) return;

    setSelectedModel(currentChat.model || "GPT-4o");
  }, [currentChat, setSelectedModel]);

}

export default useChatEffects;