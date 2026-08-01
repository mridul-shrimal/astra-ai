import { useTheme } from "../../../context/ThemeContext";
import { MessageSquare, MoreVertical } from "lucide-react";

function ChatItem({
  chat,
  currentChatId,
  onSelectChat,

  openMenu,
  setOpenMenu,

  onPinChat,
  onDuplicateChat,

  folders,
  moveFolderMenu,
  setMoveFolderMenu,
  onMoveChatToFolder,
onRenameChat,
onDeleteChat,

  onArchiveChat,
  onToggleLock,

  tags,
  tagMenu,
  setTagMenu,
  onToggleTag,
  onCreateTag,
  onDeleteTag,
  onRenameTag,
}) {
  const { theme } = useTheme();

  return (
    <div
      className={`group mb-2 flex items-center justify-between rounded-xl p-3 transition-all duration-200 ${
        currentChatId === chat.id
          ? theme === "light"
            ? "bg-cyan-100 shadow-md"
            : "bg-slate-800 shadow-md"
          : theme === "light"
          ? "bg-white hover:bg-slate-100 hover:scale-[1.02]"
          : "bg-slate-900 hover:bg-slate-800 hover:scale-[1.02]"
      }`}
    >
      {/* Chat */}
      <button
        onClick={() => onSelectChat(chat.id)}
        className="flex flex-1 items-start gap-2 overflow-hidden text-left"
      >
        <MessageSquare
          size={18}
          className="mt-0.5 shrink-0 text-cyan-400"
        />

        {chat.locked && <span>🔒</span>}

        <div className="min-w-0 flex-1">
  <div className="flex items-center gap-1">
    {chat.pinned && <span>📌</span>}

    <span
      className={`block truncate text-sm ${
        theme === "light"
          ? "text-slate-900"
          : "text-slate-200"
      }`}
    >
      {chat.title}
    </span>
  </div>

  {chat.tags?.length > 0 && (
    <div className="mt-1 flex flex-wrap gap-1">
      {chat.tags.map((tag) => (
        <span
          key={tag}
          className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${
            theme === "light"
              ? "bg-cyan-100 text-cyan-700"
              : "bg-cyan-500/20 text-cyan-300"
          }`}
        >
          🏷️ {tag}
        </span>
      ))}
    </div>
  )}
</div>
      </button>

      {/* Menu Button */}
<div className="relative ml-2">
  <button
    onClick={(e) => {
      e.stopPropagation();
      setOpenMenu(openMenu === chat.id ? null : chat.id);
    }}
    className={`rounded-md p-1 transition ${
      theme === "light"
        ? "hover:bg-slate-200"
        : "hover:bg-slate-700"
    }`}
  >
    <MoreVertical
      size={18}
      className={
        theme === "light"
          ? "text-slate-700"
          : "text-slate-300"
      }
    />
  </button>

  {openMenu === chat.id && (
    <div
      className={`absolute right-0 z-50 mt-2 w-56 rounded-xl border shadow-2xl ${
        theme === "light"
          ? "border-slate-200 bg-white"
          : "border-slate-700 bg-slate-900"
      }`}
    >
      <>
  <button
    onClick={() => {
      onPinChat(chat.id);
      setOpenMenu(null);
    }}
    className={`flex w-full items-center gap-3 px-4 py-3 text-sm ${
      theme === "light"
        ? "hover:bg-slate-100"
        : "hover:bg-slate-800"
    }`}
  >
    📌 {chat.pinned ? "Unpin" : "Pin"}
  </button>
  <button
    onClick={() => {
      onDuplicateChat(chat.id);
      setOpenMenu(null);
    }}
    className={`flex w-full items-center gap-3 px-4 py-3 text-sm ${
      theme === "light"
        ? "hover:bg-slate-100"
        : "hover:bg-slate-800"
    }`}
  >
    📄 Duplicate
  </button>
  <button
  onClick={() => {
    onArchiveChat(chat.id);
    setOpenMenu(null);
  }}
  className={`flex w-full items-center gap-3 px-4 py-3 text-sm ${
    theme === "light"
      ? "hover:bg-slate-100"
      : "hover:bg-slate-800"
  }`}
>
  📦 Archive
</button>

<button
  onClick={() => {
    onToggleLock(chat.id);
    setOpenMenu(null);
  }}
  className={`flex w-full items-center gap-3 px-4 py-3 text-sm ${
    theme === "light"
      ? "hover:bg-slate-100"
      : "hover:bg-slate-800"
  }`}
>
  {chat.locked ? "🔓 Remove Lock" : "🔒 Lock Chat"}
</button>
<div
  className={`border-t ${
    theme === "light"
      ? "border-slate-200"
      : "border-slate-700"
  }`}
>
  <button
    onClick={() =>
      setTagMenu(tagMenu === chat.id ? null : chat.id)
    }
    className={`flex w-full items-center justify-between px-4 py-3 text-sm ${
      theme === "light"
        ? "hover:bg-slate-100"
        : "hover:bg-slate-800"
    }`}
  >
    <span>🏷️ Manage Tags</span>

    <span>
      {tagMenu === chat.id ? "▼" : "▶"}
    </span>
  </button>

  {tagMenu === chat.id && (
    <div
      className={`${
        theme === "light"
          ? "bg-slate-50"
          : "bg-slate-800"
      }`}
    >
      {tags.length === 0 ? (
        <div className="px-6 py-3 text-xs opacity-70">
          No tags created yet.
        </div>
      ) : (
        tags.map((tag) => (
          <div
            key={tag}
            className={`flex items-center justify-between px-8 py-2 ${
              theme === "light"
                ? "hover:bg-slate-100"
                : "hover:bg-slate-700"
            }`}
          >
            <button
              onClick={() => onToggleTag(chat.id, tag)}
              className="flex flex-1 items-center gap-3 text-left text-sm"
            >
              {chat.tags.includes(tag) ? "✔" : "○"} {tag}
            </button>

            <div className="flex items-center gap-1">
              <button
                onClick={() => onRenameTag(tag)}
                className="rounded p-1"
              >
                ✏️
              </button>

              <button
                onClick={() => onDeleteTag(tag)}
                className="rounded p-1"
              >
                🗑️
              </button>
            </div>
          </div>
        ))
      )}

      <button
        onClick={onCreateTag}
        className={`flex w-full px-8 py-2 text-sm font-medium ${
          theme === "light"
            ? "hover:bg-slate-100"
            : "hover:bg-slate-700"
        }`}
      >
        ➕ Create New Tag
      </button>
    </div>
  )}
</div>

<button
  onClick={() => {
    onCreateTag();
    setOpenMenu(null);
  }}
  className={`flex w-full items-center gap-3 px-4 py-3 text-sm ${
    theme === "light"
      ? "hover:bg-slate-100"
      : "hover:bg-slate-800"
  }`}
>
  🏷️ Create Tag
</button>
<button
  onClick={() => {
    onRenameChat(chat.id);
    setOpenMenu(null);
  }}
  className={`flex w-full items-center gap-3 px-4 py-3 text-sm ${
    theme === "light"
      ? "hover:bg-slate-100"
      : "hover:bg-slate-800"
  }`}
>
  ✏️ Rename
</button>

<hr
  className={
    theme === "light"
      ? "border-slate-200"
      : "border-slate-700"
  }
/>

<button
  onClick={() => {
    onDeleteChat(chat.id);
    setOpenMenu(null);
  }}
  className={`flex w-full items-center gap-3 px-4 py-3 text-sm ${
    theme === "light"
      ? "text-red-600 hover:bg-red-50"
      : "text-red-400 hover:bg-red-900/20"
  }`}
>
  🗑️ Delete
</button>
<div
  className={`border-t ${
    theme === "light"
      ? "border-slate-200"
      : "border-slate-700"
  }`}
>

  <button
    onClick={() =>
      setMoveFolderMenu(
        moveFolderMenu === chat.id ? null : chat.id
      )
    }
    className={`flex w-full items-center justify-between px-4 py-3 text-sm ${
      theme === "light"
        ? "hover:bg-slate-100"
        : "hover:bg-slate-800"
    }`}
  >
    <span>📂 Move to Folder</span>

    <span>
      {moveFolderMenu === chat.id ? "▼" : "▶"}
    </span>
  </button>

  {moveFolderMenu === chat.id && (
    <div
      className={`${
        theme === "light"
          ? "bg-slate-50"
          : "bg-slate-800"
      }`}
    >
      {[...new Set(["Uncategorized", ...folders])].map(
        (folder) => (
          <button
            key={folder}
            disabled={chat.folder === folder}
            onClick={() => {
              onMoveChatToFolder(chat.id, folder);
              setMoveFolderMenu(null);
              setOpenMenu(null);
            }}
            className={`flex w-full px-8 py-2 text-left text-sm ${
              theme === "light"
                ? "hover:bg-slate-100"
                : "hover:bg-slate-700"
            }`}
          >
            {chat.folder === folder ? "✔ " : "📂 "}
            {folder}
          </button>
        )
      )}
    </div>
  )}
</div>
</>
    </div>
  )}
</div>

</div>
  );
}

export default ChatItem;