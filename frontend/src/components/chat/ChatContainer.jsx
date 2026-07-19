import { useEffect, useRef } from "react";
import ChatMessage from "./ChatMessage";

function ChatContainer({ messages }) {
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages]);

  return (
    <div className="flex-1 overflow-y-auto rounded-2xl border border-slate-800 bg-slate-900 p-6">
      {messages.map((message) => (
        <ChatMessage
          key={message.id}
          sender={message.sender}
          message={message.message}
        />
      ))}

      <div ref={bottomRef}></div>
    </div>
  );
}

export default ChatContainer;