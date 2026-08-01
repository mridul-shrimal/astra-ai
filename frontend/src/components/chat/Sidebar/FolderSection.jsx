import { ChevronDown, ChevronRight } from "lucide-react";
import { useTheme } from "../../../context/ThemeContext";

function FolderSection({
  folder,
  children,
  collapsed,
  onToggleFolder,
  onRenameFolder,
  onDeleteFolder,
}) {
  const { theme } = useTheme();
  const isLight = theme === "light";

  return (
    <div className="mb-4">
      {/* Folder Header */}
      <div
        className={`mb-2 flex items-center justify-between rounded-lg px-3 py-2 text-xs font-bold uppercase transition ${
          isLight
            ? "bg-slate-100 text-slate-700 hover:bg-slate-200"
            : "bg-slate-800 text-slate-300 hover:bg-slate-700"
        }`}
      >
        <span
          onClick={() => onToggleFolder(folder)}
          className="flex flex-1 cursor-pointer items-center gap-2"
        >
          {collapsed ? (
            <ChevronRight size={16} />
          ) : (
            <ChevronDown size={16} />
          )}

          📂 {folder}
        </span>

        {folder !== "Uncategorized" && (
          <div className="flex items-center gap-1">
            <button
              onClick={() => onRenameFolder(folder)}
              className={`rounded p-1 transition ${
                isLight
                  ? "hover:bg-slate-200"
                  : "hover:bg-slate-700"
              }`}
              title="Rename Folder"
            >
              ✏️
            </button>

            <button
              onClick={() => onDeleteFolder(folder)}
              className={`rounded p-1 transition ${
                isLight
                  ? "hover:bg-red-100"
                  : "hover:bg-red-900/20"
              }`}
              title="Delete Folder"
            >
              🗑️
            </button>
          </div>
        )}
      </div>

      {!collapsed && children}
    </div>
  );
}

export default FolderSection;