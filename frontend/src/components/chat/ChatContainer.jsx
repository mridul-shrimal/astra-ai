import { useEffect, useRef } from "react";
import { useTheme } from "../../context/ThemeContext";
import StatsModal from "./StatsModal";
import MessageList from "./container/MessageList";
import TypingIndicator from "./container/TypingIndicator";
import StopGenerating from "./container/StopGenerating";

function ChatContainer({
  messages,
  isTyping,
  isGenerating,
  onStopGenerating,
  onRegenerate,
  onFeedback,
  onFavorite,
  statsOpen,
  onCloseStats,
  setShowScrollButton,
}) {
  // =========================
  // Refs
  // =========================

  const bottomRef = useRef(null);
  const containerRef = useRef(null);
  const shouldAutoScroll = useRef(true);

  // =========================
  // Theme
  // =========================

  const { theme } = useTheme();

  // =========================
  // Scroll Detection
  // =========================

  useEffect(() => {
    const container = containerRef.current;

    if (!container) return;

    const handleScroll = () => {
      const distanceFromBottom =
        container.scrollHeight -
        container.scrollTop -
        container.clientHeight;

      shouldAutoScroll.current =
        distanceFromBottom < 120;

      if (setShowScrollButton) {
        setShowScrollButton(
          distanceFromBottom > 250
        );
      }
    };

    container.addEventListener(
      "scroll",
      handleScroll
    );

    handleScroll();

    return () => {
      container.removeEventListener(
        "scroll",
        handleScroll
      );
    };
  }, [setShowScrollButton]);

  // =========================
  // Initial Scroll
  // =========================

  useEffect(() => {
    requestAnimationFrame(() => {
      bottomRef.current?.scrollIntoView({
        behavior: "auto",
        block: "end",
      });
    });
  }, []);

  // =========================
  // Auto Scroll
  // =========================

  useEffect(() => {
    if (shouldAutoScroll.current) {
      bottomRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "end",
      });
    }
  }, [messages]);

  // =========================
  // Statistics
  // =========================

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
      msg.message
        .trim()
        .split(/\s+/)
        .filter(Boolean).length,
    0
  );

  const totalCharacters = messages.reduce(
    (count, msg) =>
      count + msg.message.length,
    0
  );

  const totalFiles = messages.reduce(
    (count, msg) =>
      count + (msg.files?.length || 0),
    0
  );

    return (
    <>
      {/* =========================
          Chat Messages
      ========================= */}

      <div
        ref={containerRef}
        id="chat-export"
        className={`relative flex-1 overflow-y-auto rounded-xl border p-3 transition-colors duration-300 sm:rounded-2xl sm:p-4 md:p-6 ${
          theme === "light"
            ? "border-slate-200 bg-white"
            : "border-slate-800 bg-slate-900"
        }`}
      >
        <MessageList
  messages={messages}
  isGenerating={isGenerating}
  onRegenerate={onRegenerate}
  onFeedback={onFeedback}
  onFavorite={onFavorite}
/>

        <TypingIndicator isTyping={isTyping} />

        <StopGenerating
  isGenerating={isGenerating}
  onStopGenerating={onStopGenerating}
/>

        {/* Bottom Scroll Target */}

        <div ref={bottomRef} />
      </div>

      {/* =========================
          Statistics Modal
      ========================= */}

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