import toast from "react-hot-toast";

export default function useMessageActions({
  currentChat,
  currentChatId,
  setChats,
}) {
  const updateCurrentMessages = (messages) => {
    setChats((prev) =>
      prev.map((chat) =>
        chat.id === currentChat.id
          ? {
              ...chat,
              messages,
              timestamp: Date.now(), // Update last activity
            }
          : chat
      )
    );
  };

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

  return {
    updateCurrentMessages,
    handleFeedback,
    handleFavoriteMessage,
  };
}