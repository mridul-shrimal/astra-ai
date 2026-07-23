import { useEffect, useRef } from "react";
import { Download } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";
import ChatMessage from "./ChatMessage";

function ChatContainer({
  messages,
  isTyping,
  isGenerating,
  onStopGenerating,
  onRegenerate,
  onFeedback,
  onExport,
}) {
  const bottomRef = useRef(null);
  const containerRef = useRef(null);
  const shouldAutoScroll = useRef(true);

  const { theme } = useTheme();

  // Detect whether user is near the bottom
  useEffect(() => {
    const container = containerRef.current;

    if (!container) return;

    const handleScroll = () => {
      const distanceFromBottom =
        container.scrollHeight -
        container.scrollTop -
        container.clientHeight;

      shouldAutoScroll.current = distanceFromBottom < 120;
    };

    container.addEventListener("scroll", handleScroll);

    handleScroll();

    return () => {
      container.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Scroll to bottom on first load
  useEffect(() => {
    requestAnimationFrame(() => {
      bottomRef.current?.scrollIntoView({
        behavior: "auto",
        block: "end",
      });
    });
  }, []);

  // Auto-scroll when new messages arrive
  useEffect(() => {
    if (shouldAutoScroll.current) {
      bottomRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "end",
      });
    }
  }, [messages]);

  return (
    <div
      ref={containerRef}
      id="chat-export"
      className={`flex-1 overflow-y-auto rounded-2xl border p-6 transition-colors duration-300 ${
        theme === "light"
          ? "border-slate-200 bg-white"
          : "border-slate-800 bg-slate-900"
      }`}
    >
      {/* Export Button */}
      <div className="mb-4 flex justify-end">
        <button
          onClick={onExport}
          className="flex items-center gap-2 rounded-lg bg-cyan-500 px-4 py-2 text-white transition hover:bg-cyan-600"
        >
          <Download size={18} />
          Export Chat
        </button>
      </div>

      {messages.map((message, index) => (
        <div key={message.id} id={`message-${message.id}`}>
          <ChatMessage
            id={message.id}
            sender={message.sender}
            message={message.message}
            files={message.files}
            liked={message.liked}
            disliked={message.disliked}
            isLastAI={
              message.sender === "ai" &&
              index === messages.length - 1
            }
            onRegenerate={onRegenerate}
            onFeedback={onFeedback}
          />
        </div>
      ))}

      {isTyping && (
        <div className="mb-4 flex justify-start">
          <div
            className={`rounded-2xl px-4 py-3 shadow-md transition-colors duration-300 ${
              theme === "light"
                ? "bg-slate-100 text-slate-700"
                : "bg-slate-800 text-gray-300"
            }`}
          >
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
            className={`rounded-full border px-5 py-2 transition-all duration-200 ${
              theme === "light"
                ? "border-red-500 text-red-600 hover:bg-red-500 hover:text-white"
                : "border-red-500 text-red-400 hover:bg-red-500 hover:text-white"
            }`}
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