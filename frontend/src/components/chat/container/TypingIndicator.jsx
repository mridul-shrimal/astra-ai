import { useTheme } from "../../../context/ThemeContext";

function TypingIndicator({ isTyping }) {
  const { theme } = useTheme();

  if (!isTyping) return null;

  return (
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
  );
}

export default TypingIndicator;