import { useEffect } from "react";

function useChatPersistence({
  chats,
  currentChatId,
  folders,
  tags,
}) {
  // Save chats
  useEffect(() => {
    localStorage.setItem("astra-chats", JSON.stringify(chats));
  }, [chats]);

  // Save current chat
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
}

export default useChatPersistence;
