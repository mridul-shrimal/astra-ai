import { useState } from "react";
import {
  Copy,
  Volume2,
  ThumbsUp,
  ThumbsDown,
  Star,
  RotateCcw,
  Download,
} from "lucide-react";

function MessageActions({
  id,
  sender,
  favorite,
  liked,
  disliked,
  copiedMessage,
  copyMessage,
  isSpeaking,
  speakMessage,
  onFavorite,
  onFeedback,
  onRegenerate,
  downloadResponse,
  isLight,
}) {
  const [showDownloadMenu, setShowDownloadMenu] =
    useState(false);

  return (
    <div
      className={`relative mt-5 flex flex-wrap items-center gap-2 border-t pt-4 ${
        isLight
          ? "border-slate-200"
          : "border-slate-700"
      }`}
    >
      {/* Copy */}

      <button
        onClick={copyMessage}
        className={`flex h-9 w-9 items-center justify-center rounded-lg transition ${
          isLight
            ? "bg-slate-100 text-slate-700 hover:bg-cyan-500 hover:text-white"
            : "bg-slate-900 text-slate-300 hover:bg-cyan-600 hover:text-white"
        }`}
        title="Copy"
      >
        {copiedMessage ? (
          <span className="text-sm text-green-400">
            ✅
          </span>
        ) : (
          <Copy size={18} />
        )}
      </button>

      {/* Favorite */}

      <button
        onClick={() => onFavorite(id)}
        className={`flex h-9 w-9 items-center justify-center rounded-lg transition ${
          favorite
            ? "bg-yellow-500 text-white"
            : isLight
            ? "bg-slate-100 text-slate-700 hover:bg-yellow-400 hover:text-white"
            : "bg-slate-900 text-slate-300 hover:bg-yellow-500 hover:text-white"
        }`}
      >
        <Star
          size={18}
          fill={favorite ? "currentColor" : "none"}
        />
      </button>

      {/* Read */}

      <button
        onClick={speakMessage}
        className={`flex h-9 w-9 items-center justify-center rounded-lg transition ${
          isLight
            ? "bg-slate-100 text-slate-700 hover:bg-cyan-500 hover:text-white"
            : "bg-slate-900 text-slate-300 hover:bg-cyan-600 hover:text-white"
        }`}
      >
        {isSpeaking ? (
          <span>⏹</span>
        ) : (
          <Volume2 size={18} />
        )}
      </button>

      {/* Like */}

      <button
        onClick={() => onFeedback(id, "like")}
        className={`flex h-9 w-9 items-center justify-center rounded-lg transition ${
          liked
            ? "bg-cyan-600 text-white"
            : isLight
            ? "bg-slate-100 text-slate-700 hover:bg-cyan-500 hover:text-white"
            : "bg-slate-900 text-slate-300 hover:bg-cyan-600 hover:text-white"
        }`}
      >
        <ThumbsUp size={18} />
      </button>

      {/* Dislike */}

      <button
        onClick={() => onFeedback(id, "dislike")}
        className={`flex h-9 w-9 items-center justify-center rounded-lg transition ${
          disliked
            ? "bg-red-600 text-white"
            : isLight
            ? "bg-slate-100 text-slate-700 hover:bg-red-500 hover:text-white"
            : "bg-slate-900 text-slate-300 hover:bg-red-600 hover:text-white"
        }`}
      >
        <ThumbsDown size={18} />
      </button>

      {/* Regenerate */}

      {sender === "ai" && (
        <button
          onClick={() => onRegenerate(id)}
          className={`flex h-9 w-9 items-center justify-center rounded-lg transition ${
            isLight
              ? "bg-slate-100 text-slate-700 hover:bg-cyan-500 hover:text-white"
              : "bg-slate-900 text-slate-300 hover:bg-cyan-600 hover:text-white"
          }`}
        >
          <RotateCcw size={18} />
        </button>
      )}

      {/* Download */}

      {sender === "ai" && (
        <div className="relative">
          <button
            onClick={() =>
              setShowDownloadMenu(!showDownloadMenu)
            }
            className={`flex h-9 w-9 items-center justify-center rounded-lg transition ${
              isLight
                ? "bg-slate-100 text-slate-700 hover:bg-cyan-500 hover:text-white"
                : "bg-slate-900 text-slate-300 hover:bg-cyan-600 hover:text-white"
            }`}
          >
            <Download size={18} />
          </button>

          {showDownloadMenu && (
            <div
              className={`absolute bottom-12 right-0 z-50 w-44 rounded-xl border shadow-xl ${
                isLight
                  ? "border-slate-200 bg-white"
                  : "border-slate-700 bg-slate-900"
              }`}
            >
              {[
                ["pdf", "📄 PDF"],
                ["txt", "📃 TXT"],
                ["html", "🌐 HTML"],
                ["md", "📝 Markdown"],
                ["json", "📦 JSON"],
              ].map(([type, label], index) => (
                <button
                  key={type}
                  onClick={() => {
                    downloadResponse(type);
                    setShowDownloadMenu(false);
                  }}
                  className={`block w-full px-4 py-3 text-left ${
                    index === 4 ? "rounded-b-xl" : ""
                  } ${
                    isLight
                      ? "hover:bg-slate-100"
                      : "hover:bg-slate-800"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default MessageActions;