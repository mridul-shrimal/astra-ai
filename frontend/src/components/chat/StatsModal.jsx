import { X } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";

function StatsModal({
  open,
  onClose,
  totalMessages,
  userMessages,
  aiMessages,
  totalWords,
  totalCharacters,
  totalFiles,
}) {
  const { theme } = useTheme();
  const isLight = theme === "light";

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div
        className={`w-[90%] max-w-md rounded-2xl shadow-2xl ${
          isLight ? "bg-white" : "bg-slate-900"
        }`}
      >
        {/* Header */}
        <div
          className={`flex items-center justify-between border-b p-5 ${
            isLight ? "border-slate-200" : "border-slate-700"
          }`}
        >
          <h2
            className={`text-xl font-bold ${
              isLight ? "text-slate-900" : "text-white"
            }`}
          >
            📊 Chat Statistics
          </h2>

          <button
            onClick={onClose}
            className={`rounded-lg p-2 transition ${
              isLight
                ? "hover:bg-slate-100"
                : "hover:bg-slate-800"
            }`}
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="space-y-4 p-6">

          <StatRow label="💬 Total Messages" value={totalMessages} />
          <StatRow label="👤 User Messages" value={userMessages} />
          <StatRow label="🤖 AI Responses" value={aiMessages} />
          <StatRow label="📝 Total Words" value={totalWords} />
          <StatRow label="🔤 Characters" value={totalCharacters} />
          <StatRow label="📎 Files Uploaded" value={totalFiles} />

        </div>

        {/* Footer */}
        <div className="p-5">
          <button
            onClick={onClose}
            className="w-full rounded-xl bg-cyan-500 py-3 font-semibold text-white transition hover:bg-cyan-600"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

function StatRow({ label, value }) {
  const { theme } = useTheme();
  const isLight = theme === "light";

  return (
    <div
      className={`flex items-center justify-between rounded-xl p-3 ${
        isLight ? "bg-slate-100" : "bg-slate-800"
      }`}
    >
      <span
        className={isLight ? "text-slate-700" : "text-slate-300"}
      >
        {label}
      </span>

      <span
        className={`font-bold ${
          isLight ? "text-slate-900" : "text-white"
        }`}
      >
        {value}
      </span>
    </div>
  );
}

export default StatsModal;