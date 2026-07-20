import { useEffect, useRef } from "react";
import ChatMessage from "./ChatMessage";

function ChatContainer({
  messages,
  isTyping,
  onRegenerate,
}) {
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: messages.length <= 2 ? "auto" : "smooth",
    });
  }, [messages, isTyping]);

  return (
    <div className="flex-1 overflow-y-auto rounded-2xl border border-slate-800 bg-slate-900 p-6">
      {messages.map((message, index) => (
       <ChatMessage
  key={message.id}
  sender={message.sender}
  message={message.message}
  isLastAI={
    message.sender === "ai" &&
    index === messages.length - 1
  }
  onRegenerate={onRegenerate}
/>
      ))}

      {isTyping && (
        <div className="flex justify-start mb-4">
          <div className="rounded-2xl bg-slate-800 px-4 py-3 shadow-md text-gray-300">
            <div className="flex items-center gap-2">
              <span>Astra is typing</span>

              <span className="flex gap-1">
                <span className="h-2 w-2 rounded-full bg-cyan-400 animate-bounce"></span>

                <span
                  className="h-2 w-2 rounded-full bg-cyan-400 animate-bounce"
                  style={{ animationDelay: "0.2s" }}
                ></span>

                <span
                  className="h-2 w-2 rounded-full bg-cyan-400 animate-bounce"
                  style={{ animationDelay: "0.4s" }}
                ></span>
              </span>
            </div>
          </div>
        </div>
      )}

      <div ref={bottomRef}></div>
    </div>
  );
}

export default ChatContainer;