function ChatMessage({ sender, message }) {
  const isUser = sender === "user";

  return (
    <div
      className={`flex mb-4 ${
        isUser ? "justify-end" : "justify-start"
      }`}
    >
      <div
        className={`max-w-[70%] rounded-2xl px-4 py-3 shadow-md ${
          isUser
            ? "bg-cyan-500 text-white"
            : "bg-slate-800 text-gray-100"
        }`}
      >
        <p>{message}</p>
      </div>
    </div>
  );
}

export default ChatMessage;