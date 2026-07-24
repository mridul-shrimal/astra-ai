import { useEffect, useRef, useState } from "react";
import { Download } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";
import ChatMessage from "./ChatMessage";
import StatsModal from "./StatsModal";
function ChatContainer({
  messages,
  isTyping,
  isGenerating,
  onStopGenerating,
  onRegenerate,
  onFeedback,
  onExport,

  onOpenStats,
  statsOpen,
  onCloseStats,
}) {
  const bottomRef = useRef(null);
  const containerRef = useRef(null);
  const shouldAutoScroll = useRef(true);
const [showScrollButton, setShowScrollButton] = useState(false);
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
      setShowScrollButton(distanceFromBottom > 250);
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
const totalMessages = messages.length;

const userMessages = messages.filter(
  (msg) => msg.sender === "user"
).length;

const aiMessages = messages.filter(
  (msg) => msg.sender === "ai"
).length;

const totalWords = messages.reduce(
  (count, msg) =>
    count +
    msg.message.trim().split(/\s+/).filter(Boolean).length,
  0
);

const totalCharacters = messages.reduce(
  (count, msg) => count + msg.message.length,
  0
);

const totalFiles = messages.reduce(
  (count, msg) => count + (msg.files?.length || 0),
  0
);
  return (
    <>
    <div
      ref={containerRef}
      id="chat-export"
      className={`flex-1 overflow-y-auto rounded-xl border p-3 transition-colors duration-300 sm:rounded-2xl sm:p-4 md:p-6 ${
        theme === "light"
          ? "border-slate-200 bg-white"
          : "border-slate-800 bg-slate-900"
      }`}
    >
      {/* Top Actions */}
<div className="mb-4 flex justify-end gap-3">
  <button
  onClick={onOpenStats}
  className="flex items-center gap-2 rounded-lg bg-violet-500 px-3 py-2 text-sm text-white transition hover:bg-violet-600 sm:px-4 sm:text-base"
>
  📊 Stats
</button>
        <button
          onClick={onExport}
          className="flex items-center gap-2 rounded-lg bg-cyan-500 px-3 py-2 text-sm text-white transition hover:bg-cyan-600 sm:px-4 sm:text-base"
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
            className={`max-w-full rounded-2xl px-3 py-3 shadow-md transition-colors duration-300 sm:px-4 ${
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
            className={`rounded-full border px-4 py-2 text-sm transition-all duration-200 sm:px-5 sm:text-base ${
              theme === "light"
                ? "border-red-500 text-red-600 hover:bg-red-500 hover:text-white"
                : "border-red-500 text-red-400 hover:bg-red-500 hover:text-white"
            }`}
          >
            ⏹ Stop Generating
          </button>
        </div>
      )}

          {showScrollButton && (
  <button
    onClick={() =>
      bottomRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "end",
      })
    }
    className="fixed bottom-24 right-6 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-cyan-500 text-xl text-white shadow-lg transition hover:scale-110 hover:bg-cyan-600"
    title="Scroll to Bottom"
  >
    ↓
  </button>
)}

<div ref={bottomRef} />
    </div>

    <StatsModal
  open={statsOpen}
  onClose={onCloseStats}
  totalMessages={totalMessages}
  userMessages={userMessages}
  aiMessages={aiMessages}
  totalWords={totalWords}
  totalCharacters={totalCharacters}
  totalFiles={totalFiles}
/>
  </>
);
}

export default ChatContainer;