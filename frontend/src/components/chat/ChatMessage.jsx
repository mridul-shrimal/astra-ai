// =========================
// Imports
// =========================
import useMessageActions from "../../hooks/chat/useMessageActions";
import { memo } from "react";

import { useTheme } from "../../context/ThemeContext";
import MessageFiles from "./message/MessageFiles";
import MarkdownRenderer from "./message/MarkdownRenderer";
import CodeBlock from "./message/CodeBlock";
import MessageActions from "./message/MessageActions";

import {
  Bot,
  UserCircle2,
} from "lucide-react";

// =========================
// Component
// =========================

function ChatMessage({
  id,
  sender,
  message,
  timestamp,
  files,
    isLastAI,
  isGenerating,
  liked,
  disliked,
  favorite,
  onRegenerate,
  onFeedback,
  onFavorite,
}) {
  // =========================
  // Derived Values
  // =========================

  const isUser = sender === "user";

  // =========================
  // Context
  // =========================

  const { theme } = useTheme();

const isLight = theme === "light";

const settings =
  JSON.parse(localStorage.getItem("astra-settings")) || {};

const fontSize = settings.fontSize || "medium";

const showTimestamp =
  settings.showTimestamp ?? true;
const {
  copiedCode,
  copiedMessage,
  isSpeaking,
  copyCode,
  copyMessage,
  speakMessage,
  downloadResponse,
} = useMessageActions(message);

  // =========================
  // Render
  // =========================

  return (
    // =========================
// Message Layout
// =========================
    <div
      className={`group mb-8 flex items-start gap-4 ${
        isUser ? "flex-row-reverse" : ""
      }`}
    >

            {/* =========================
          Avatar
      ========================= */}

      <div
        className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full shadow-lg ring-2 transition-all duration-200 ${
          isUser
            ? isLight
              ? "ring-cyan-200"
              : "ring-cyan-700/40"
            : isLight
            ? "ring-slate-200"
            : "ring-slate-700"
        } ${
          isUser
            ? "bg-linear-to-br from-violet-500 to-fuchsia-600"
            : "bg-linear-to-br from-cyan-500 to-blue-600"
        }`}
      >
        {isUser ? (
          <UserCircle2
            size={24}
            className="text-white"
          />
        ) : (
          <Bot
            size={24}
            className="text-white"
          />
        )}
      </div>

      {/* =========================
    Message Content
========================= */}

      <div className="flex min-w-0 flex-1 flex-col">

        {/* Sender */}

        <div
          className={`mb-2 text-sm font-semibold ${
            isUser
              ? isLight
                ? "text-right text-cyan-700"
                : "text-right text-cyan-300"
              : isLight
              ? "text-slate-600"
              : "text-slate-400"
          }`}
        >
          {isUser ? "You" : "Astra"}
        </div>

        {/* =========================
    Message Bubble
========================= */}

        <div
          className={`rounded-2xl px-6 py-5 shadow-lg transition-all duration-200 ${
            isUser
              ? isLight
                ? "ml-auto max-w-[85%] border border-cyan-200 bg-cyan-50 text-slate-900"
                : "ml-auto max-w-[85%] bg-cyan-500 text-white"
              : isLight
              ? "max-w-[85%] border border-slate-200 bg-white text-slate-900"
              : "max-w-[85%] border border-slate-700 bg-slate-800 text-gray-100"
          }`}
        >
          {isUser ? (
            <>
             <MessageFiles
  files={files}
  isLight={isLight}
/>

              {/* User Message */}

              <p
  className={`whitespace-pre-wrap leading-7 ${
  fontSize === "small"
    ? "text-xs"
    : fontSize === "large"
    ? "text-2xl"
    : "text-base"
}`}
>
                {message}
              </p>
            </>
          ) : (
                        <>
 <div
  className={`${
    fontSize === "small"
      ? "text-xs"
      : fontSize === "large"
      ? "text-2xl"
      : "text-base"
  }`}
>
<MarkdownRenderer
  message={message}
  isLight={isLight}
  copyCode={copyCode}
  copiedCode={copiedCode}
  CodeBlock={CodeBlock}
  isGenerating={isGenerating}
  isLastAI={isLastAI}
/>
</div>
              {/* =========================
                  Timestamp
              ========================= */}

              {showTimestamp && timestamp && (
                <div
                  className={`mt-3 text-xs ${
                    isLight
                      ? "text-slate-500"
                      : "text-slate-400"
                  }`}
                >
                  {new Date(timestamp).toLocaleTimeString(
                    [],
                    {
                      hour: "2-digit",
                      minute: "2-digit",
                    }
                  )}
                </div>
              )}

             <MessageActions
  id={id}
  sender={sender}
  favorite={favorite}
  liked={liked}
  disliked={disliked}
  copiedMessage={copiedMessage}
  copyMessage={copyMessage}
  isSpeaking={isSpeaking}
  speakMessage={speakMessage}
  onFavorite={onFavorite}
  onFeedback={onFeedback}
  onRegenerate={onRegenerate}
  downloadResponse={downloadResponse}
  isLight={isLight}
/>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default memo(ChatMessage);