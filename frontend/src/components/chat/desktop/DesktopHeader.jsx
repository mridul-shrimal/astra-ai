import { Menu } from "lucide-react";
import { useTheme } from "../../../context/ThemeContext";
import { Keyboard } from "lucide-react";

function DesktopHeader({
  sidebarOpen,
  setSidebarOpen,
  onOpenStats,
  onOpenShortcuts,
  onOpenFavorites,
  setExportOpen,
}) {
  const { theme } = useTheme();

  return (
    <div
      className={`flex shrink-0 items-center gap-3 border-b px-4 py-3 md:px-6 md:py-4 ${
        theme === "light"
          ? "border-slate-200 bg-white"
          : "border-slate-800 bg-slate-950"
      }`}
    >
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className={`rounded-lg p-2 transition ${
          theme === "light"
            ? "hover:bg-slate-100"
            : "hover:bg-slate-800"
        }`}
      >
        <Menu
          size={24}
          className={
            theme === "light"
              ? "text-slate-900"
              : "text-white"
          }
        />
      </button>

      <div className="flex w-full items-center justify-between">
        {/* Title */}
        <div>
          <h1
            className={`text-xl font-bold md:text-3xl ${
              theme === "light"
                ? "text-slate-900"
                : "text-white"
            }`}
          >
            Astra AI
          </h1>

          <p
            className={`hidden md:block ${
              theme === "light"
                ? "text-slate-600"
                : "text-slate-400"
            }`}
          >
            Your intelligent AI assistant
          </p>
        </div>

        {/* Header Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={onOpenStats}
            className="rounded-lg bg-violet-500 px-3 py-2 text-white transition hover:bg-violet-600"
            title="Chat Statistics"
          >
            📊
          </button>

          <button
            onClick={onOpenFavorites}
            className="rounded-lg bg-yellow-500 px-3 py-2 text-white transition hover:bg-yellow-600"
            title="Favorite Messages"
          >
            ⭐
          </button>

<button
  onClick={onOpenShortcuts}
  title="Keyboard Shortcuts"
  className={`rounded-xl p-2 transition ${
    theme === "light"
      ? "hover:bg-slate-100"
      : "hover:bg-slate-800"
  }`}
>
  <Keyboard size={20} />

</button>
          <button
            onClick={() => setExportOpen(true)}
            className="rounded-lg bg-cyan-500 px-3 py-2 text-white transition hover:bg-cyan-600"
            title="Export Chat"
          >
            📤
          </button>
        </div>
      </div>
    </div>
  );
}

export default DesktopHeader;