import ChatMessage from "../ChatMessage";

function MessageList({
  messages,
  isGenerating,
  onRegenerate,
  onFeedback,
  onFavorite,
}) {
  return (
    <>
      {messages.map((message, index) => (
        <div
          key={message.id}
          id={`message-${message.id}`}
        >
          <ChatMessage
            id={message.id}
            sender={message.sender}
            message={message.message}
            timestamp={message.timestamp}
            files={message.files}
            liked={message.liked}
            disliked={message.disliked}
            favorite={message.favorite}
            isLastAI={
              message.sender === "ai" &&
              index === messages.length - 1
            }
            isGenerating={isGenerating}
            onRegenerate={onRegenerate}
            onFeedback={onFeedback}
            onFavorite={onFavorite}
          />
        </div>
      ))}
    </>
  );
}

export default MessageList;