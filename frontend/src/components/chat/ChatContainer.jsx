import { useEffect, useRef } from "react";
import { Download } from "lucide-react";

import ChatMessage from "./ChatMessage";

function ChatContainer({
  messages,
  isTyping,
  isGenerating,
  onStopGenerating,
  onRegenerate,
  onExport,
}) {
  const bottomRef = useRef(null);
const containerRef = useRef(null);
 useEffect(() => {
  if (!containerRef.current) return;

  containerRef.current.scrollTop =
    containerRef.current.scrollHeight;
}, [messages]);

  return (
    <div
  id="chat-export"
  className="flex-1 overflow-y-auto rounded-2xl border border-slate-800 bg-slate-900 p-6"
>
      {/* Export Button */}
      <div className="mb-4 flex justify-end">
        <button
          onClick={onExport}
          className="flex items-center gap-2 rounded-lg bg-cyan-500 px-4 py-2 text-white hover:bg-cyan-600 transition"
        >
          <Download size={18} />
          Export Chat
        </button>
      </div>

      {messages.map((message, index) => (
  <ChatMessage
  key={message.id}
  sender={message.sender}
  message={message.message}
  files={message.files}
  isLastAI={
    message.sender === "ai" &&
    index === messages.length - 1
  }
  onRegenerate={onRegenerate}
/>
      ))}

      {isTyping && (
        <div className="mb-4 flex justify-start">
          <div className="rounded-2xl bg-slate-800 px-4 py-3 shadow-md text-gray-300">
            <div className="flex items-center gap-2">
              <span>Astra is typing</span>

              <span className="flex gap-1">
                <span className="h-2 w-2 animate-bounce rounded-full bg-cyan-400"></span>

                <span
                  className="h-2 w-2 animate-bounce rounded-full bg-cyan-400"
                  style={{ animationDelay: "0.2s" }}
                ></span>

                <span
                  className="h-2 w-2 animate-bounce rounded-full bg-cyan-400"
                  style={{ animationDelay: "0.4s" }}
                ></span>
              </span>
            </div>
          </div>
        </div>
      )}

      {isGenerating && (
        <div className="my-4 flex justify-center">
          <button
            onClick={onStopGenerating}
            className="rounded-full border border-red-500 px-5 py-2 text-red-400 transition-all duration-200 hover:bg-red-500 hover:text-white"
          >
            ⏹ Stop Generating
          </button>
        </div>
      )}

       <div ref={bottomRef}></div>
    </div>
  );
}

export default ChatContainer;