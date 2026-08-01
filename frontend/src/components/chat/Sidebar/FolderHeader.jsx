function FolderHeader({
  folder,
  theme,
  toggleFolder,
  onRenameFolder,
  onDeleteFolder,
}) {
  return (
    <div
      className={`mb-2 flex w-full items-center justify-between rounded-lg px-3 py-2 text-xs font-bold transition ${
        theme === "light"
          ? "bg-slate-100 text-slate-700 hover:bg-slate-200"
          : "bg-slate-800 text-slate-300 hover:bg-slate-700"
      }`}
    >
      <span
        onClick={() => toggleFolder(folder)}
        className="flex-1 cursor-pointer"
      >
        📂 {folder}
      </span>

      {folder !== "Uncategorized" && (
        <div className="flex items-center gap-1">
          <button
            onClick={() => onRenameFolder(folder)}
            className={`rounded p-1 transition ${
              theme === "light"
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
              theme === "light"
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
  );
}

export default FolderHeader;