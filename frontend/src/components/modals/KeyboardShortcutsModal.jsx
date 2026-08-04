import { X, Keyboard } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";

const shortcuts = [
  {
    action: "New Chat",
    keys: ["Alt", "N"],
  },
  {
    action: "Focus Search",
    keys: ["Alt", "K"],
  },
  {
    action: "Quick Search",
    keys: ["/"],
  },
  {
    action: "Toggle Sidebar",
    keys: ["Alt", "B"],
  },
  {
    action: "Send Message",
    keys: ["Ctrl", "Enter"],
  },
  {
    action: "New Line",
    keys: ["Shift", "Enter"],
  },
  {
    action: "Close Menus",
    keys: ["Esc"],
  },
  {
    action: "Export Chat",
    keys: ["Alt", "E"],
  },
];

export default function KeyboardShortcutsModal({
  open,
  onClose,
}) {
  const { theme } = useTheme();
  const isLight = theme === "light";

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-999 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={`w-full max-w-xl rounded-3xl border shadow-2xl transition-all ${
          isLight
            ? "border-slate-200 bg-white"
            : "border-slate-700 bg-slate-900"
        }`}
      >
        {/* Header */}

        <div
          className={`flex items-center justify-between border-b px-6 py-5 ${
            isLight
              ? "border-slate-200"
              : "border-slate-800"
          }`}
        >
          <div className="flex items-center gap-3">
            <Keyboard
              size={22}
              className="text-cyan-500"
            />

            <h2 className="text-xl font-bold">
              Keyboard Shortcuts
            </h2>
          </div>

          <button
            onClick={onClose}
            className="rounded-lg p-2 transition hover:bg-slate-700/10"
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}

        <div className="space-y-2 p-6">
          {shortcuts.map((shortcut) => (
            <div
              key={shortcut.action}
              className={`flex items-center justify-between rounded-xl px-4 py-3 ${
                isLight
                  ? "hover:bg-slate-100"
                  : "hover:bg-slate-800"
              }`}
            >
              <span className="font-medium">
                {shortcut.action}
              </span>

              <div className="flex items-center gap-2">
                {shortcut.keys.map((key, index) => (
                  <div
                    key={index}
                    className={`rounded-lg border px-3 py-1 text-xs font-semibold shadow-sm ${
                      isLight
                        ? "border-slate-300 bg-slate-100"
                        : "border-slate-600 bg-slate-800"
                    }`}
                  >
                    {key}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}

        <div
          className={`border-t px-6 py-4 text-center text-sm ${
            isLight
              ? "border-slate-200 text-slate-500"
              : "border-slate-800 text-slate-400"
          }`}
        >
          Press <strong>Esc</strong> to close this window.
        </div>
      </div>
    </div>
  );
}