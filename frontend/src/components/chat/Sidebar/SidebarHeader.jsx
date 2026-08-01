import { FolderPlus, MessageSquarePlus } from "lucide-react";
import { useTheme } from "../../../context/ThemeContext";

function SidebarHeader({
  onNewChat,
  onCreateFolder,
}) {
  const { theme } = useTheme();
  const isLight = theme === "light";

  return (
    <div
      className={`border-b p-4 ${
        isLight
          ? "border-slate-200"
          : "border-slate-800"
      }`}
    >
      <button
        onClick={onNewChat}
        className="mb-3 flex w-full items-center justify-center gap-2 rounded-xl bg-cyan-500 py-3 font-semibold text-white transition hover:bg-cyan-600"
      >
        <MessageSquarePlus size={20} />
        New Chat
      </button>

      <button
        onClick={onCreateFolder}
        className={`flex w-full items-center justify-center gap-2 rounded-xl border py-2 transition ${
          isLight
            ? "border-slate-300 hover:bg-slate-100"
            : "border-slate-700 hover:bg-slate-800"
        }`}
      >
        <FolderPlus size={18} />
        New Folder
      </button>
    </div>
  );
}

export default SidebarHeader;