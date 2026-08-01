import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import { useTheme } from "../../context/ThemeContext";

import {
  Search,
  MessageSquare,
  MessageSquarePlus,
  Settings,
  MoreVertical,
  Pin,
  Copy,
  Archive,
  Pencil,
  Trash2,
  FolderPlus,
  ChevronDown,
  ChevronRight,
} from "lucide-react";

function ChatSidebar({
  // Chat Data
  chats,
  folders,
  currentChatId,

  // Search
  searchQuery,
  onSearchChange,

  // Chat Actions
  onNewChat,
  onSelectChat,
  onDeleteChat,
  onRenameChat,
  onPinChat,
  onDuplicateChat,
  onArchiveChat,

  // Folder Actions
  onCreateFolder,
  onDeleteFolder,
  onRenameFolder,
  onMoveChatToFolder,

  // Tag Actions
  onCreateTag,
  tags,
  selectedTag,
  setSelectedTag,
  onToggleTag,
  onDeleteTag,
  onRenameTag,
  onToggleLock,
}) {
  const { theme } = useTheme();
  const navigate = useNavigate();

  const menuRef = useRef(null);

  const [openMenu, setOpenMenu] = useState(null);
  const [moveFolderMenu, setMoveFolderMenu] =
    useState(null);
  const [tagMenu, setTagMenu] = useState(null);
  const [showArchived, setShowArchived] =
    useState(true);

  // =========================
  // Folder Collapse State
  // =========================

  const [collapsedFolders, setCollapsedFolders] =
    useState({});

  // =========================
  // Close Menu on Outside Click
  // =========================

  useEffect(() => {
    const closeMenu = (e) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(e.target)
      ) {
        setOpenMenu(null);
      }
    };

    document.addEventListener(
      "mousedown",
      closeMenu
    );

    return () =>
      document.removeEventListener(
        "mousedown",
        closeMenu
      );
  }, []);

  // =========================
  // Visible Chats
  // =========================

  const visibleChats = useMemo(() => {
    return chats
      .filter((chat) => !chat.archived)

      // Search
      .filter((chat) =>
        chat.title
          .toLowerCase()
          .includes(searchQuery.toLowerCase())
      )

      // Tag Filter
      .filter(
        (chat) =>
          selectedTag === "All" ||
          chat.tags?.includes(selectedTag)
      )

      // Pin Sorting
      .sort(
        (a, b) =>
          Number(b.pinned) -
          Number(a.pinned)
      );
  }, [
    chats,
    searchQuery,
    selectedTag,
  ]);

  // =========================
  // Group Chats by Folder
  // =========================

  const groupedChats = useMemo(() => {
    const groups = {};

    folders.forEach((folder) => {
      groups[folder] = [];
    });

    if (!groups["Uncategorized"]) {
      groups["Uncategorized"] = [];
    }

    visibleChats.forEach((chat) => {
      const folder =
        chat.folder || "Uncategorized";

      if (!groups[folder]) {
        groups[folder] = [];
      }

      groups[folder].push(chat);
    });

    return groups;
  }, [folders, visibleChats]);

  // =========================
  // Toggle Folder
  // =========================

  const toggleFolder = (folder) => {
    setCollapsedFolders((prev) => ({
      ...prev,
      [folder]: !prev[folder],
    }));
  };

  return (
    <aside
      className={`flex h-full w-72 max-w-[85vw] flex-col border-r shadow-xl md:shadow-none ${
        theme === "light"
          ? "border-slate-200 bg-white"
          : "border-slate-800 bg-slate-950"
      }`}
    >
      {/* =========================
          New Chat Section
      ========================= */}

      <div
        className={`border-b p-4 ${
          theme === "light"
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
            theme === "light"
              ? "border-slate-300 hover:bg-slate-100"
              : "border-slate-700 hover:bg-slate-800"
          }`}
        >
          <FolderPlus size={18} />
          New Folder
        </button>
      </div>

    {/* Search */}
    <div
      className={`border-b p-4 ${
        theme === "light"
          ? "border-slate-200"
          : "border-slate-800"
      }`}
    >
      <div className="relative">
        <Search
          size={18}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
        />

        <input
          value={searchQuery}
          onChange={(e) =>
            onSearchChange(e.target.value)
          }
          placeholder="Search chats..."
          className={`w-full rounded-xl border py-3 pl-10 pr-4 outline-none ${
            theme === "light"
              ? "border-slate-300 bg-white"
              : "border-slate-700 bg-slate-900 text-white"
          }`}
        />
      </div>
    </div>

{/* Tags */}
{tags.length > 0 && (
  <div
    className={`border-b p-4 ${
      theme === "light"
        ? "border-slate-200"
        : "border-slate-800"
    }`}
  >
    <p
      className={`mb-2 text-xs font-bold uppercase ${
        theme === "light"
          ? "text-slate-500"
          : "text-slate-400"
      }`}
    >
      🏷 Tags
    </p>

    <div className="flex flex-wrap gap-2">
      <button
        onClick={() => setSelectedTag("All")}
        className={`rounded-full px-3 py-1 text-xs transition ${
          selectedTag === "All"
            ? "bg-cyan-500 text-white"
            : theme === "light"
            ? "bg-slate-100 hover:bg-slate-200"
            : "bg-slate-800 hover:bg-slate-700"
        }`}
      >
        All
      </button>

      {tags.map((tag) => (
        <button
          key={tag}
          onClick={() => setSelectedTag(tag)}
          className={`rounded-full px-3 py-1 text-xs transition ${
            selectedTag === tag
              ? "bg-cyan-500 text-white"
              : theme === "light"
              ? "bg-slate-100 hover:bg-slate-200"
              : "bg-slate-800 hover:bg-slate-700"
          }`}
        >
          {tag}
        </button>
      ))}
    </div>
  </div>
)}

    {/* Chat List */}
    <div className="flex-1 overflow-y-auto p-3">
      {Object.entries(groupedChats).map(
        ([folder, folderChats]) => (
          <div key={folder} className="mb-4">

            {/* Folder Header */}

            <div
  className={`mb-2 flex w-full items-center justify-between rounded-lg px-3 py-2 text-xs font-bold uppercase transition ${
    theme === "light"
      ? "bg-slate-100 text-slate-700 hover:bg-slate-200"
      : "bg-slate-800 text-slate-300 hover:bg-slate-700"
  }`}
>
  <span
    onClick={() => toggleFolder(folder)}
    className="cursor-pointer flex-1"
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

              <span
  onClick={() => toggleFolder(folder)}
  className="cursor-pointer"
>
  {collapsedFolders[folder] ? (
    <ChevronRight size={16} />
  ) : (
    <ChevronDown size={16} />
  )}
</span>

            {!collapsedFolders[folder] &&
              folderChats.map((chat) => (
                <div
  key={chat.id}
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
{chat.locked && <span title="Locked Chat">🔒</span>}

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

  {/* 3 Dot */}
  <div className="relative ml-2">
    <button
      onClick={(e) => {
        e.stopPropagation();
        setOpenMenu(
          openMenu === chat.id ? null : chat.id
        );
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
        ref={menuRef}
        className={`absolute right-0 z-50 mt-2 w-56 overflow-hidden rounded-xl border shadow-2xl ${
          theme === "light"
            ? "border-slate-200 bg-white"
            : "border-slate-700 bg-slate-900"
        }`}
      >
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
          <Pin size={16} />
          {chat.pinned ? "Unpin" : "Pin"}
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
  <Copy size={16} />
  Duplicate
</button>

{/* Move to Folder */}
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
    className={`flex w-full items-center justify-between px-4 py-3 text-sm transition ${
      theme === "light"
        ? "hover:bg-slate-100"
        : "hover:bg-slate-800"
    }`}
  >
    <span className="flex items-center gap-3">
      📂 Move to Folder
    </span>

    <span>
      {moveFolderMenu === chat.id ? "▼" : "▶"}
    </span>
  </button>

  {moveFolderMenu === chat.id && (
    <div
      className={`overflow-hidden ${
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
            className={`flex w-full items-center gap-3 px-8 py-2 text-sm transition ${
              theme === "light"
                ? "hover:bg-slate-100"
                : "hover:bg-slate-700"
            }`}
          >
            <>
  {chat.folder === folder ? "✔" : "📂"} {folder}
</>
          </button>
        )
      )}
    </div>
  )}
</div>
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
  <Archive size={16} />
  Archive
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
  {chat.locked ? "🔓" : "🔒"}
  {chat.locked ? "🔑 Remove Lock" : "🔒 Lock Chat"}
</button>
{/* Manage Tags */}
<div
  className={`border-t ${
    theme === "light"
      ? "border-slate-200"
      : "border-slate-700"
  }`}
>
  <button
    onClick={() =>
      setTagMenu(
        tagMenu === chat.id ? null : chat.id
      )
    }
    className={`flex w-full items-center justify-between px-4 py-3 text-sm transition ${
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
      className={`overflow-hidden ${
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
    className={`rounded p-1 transition ${
      theme === "light"
        ? "hover:bg-slate-200"
        : "hover:bg-slate-600"
    }`}
    title="Rename Tag"
  >
    ✏️
  </button>

  <button
    onClick={() => onDeleteTag(tag)}
    className={`rounded p-1 transition ${
      theme === "light"
        ? "hover:bg-red-100"
        : "hover:bg-red-900/20"
    }`}
    title="Delete Tag"
  >
    🗑️
  </button>
</div>
  </div>
))
      )}

      <button
        onClick={onCreateTag}
        className={`flex w-full items-center gap-3 px-8 py-2 text-sm font-medium ${
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
  className={`flex w-full items-center gap-3 px-4 py-3 text-sm transition ${
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
          <Pencil size={16} />
          Rename
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
          <Trash2 size={16} />
          Delete
        </button>
      </div>
    )}
  </div>
</div>
      ))
    }
  </div>
))
}
</div>
    {/* Archived Chats */}
    {chats.filter((chat) => chat.archived).length > 0 && (
      <div
        className={`border-t p-3 ${
          theme === "light"
            ? "border-slate-200"
            : "border-slate-800"
        }`}
      >
        <button
          onClick={() => setShowArchived(!showArchived)}
          className={`mb-2 flex w-full items-center justify-between rounded-lg px-2 py-2 text-xs font-semibold uppercase tracking-wider transition ${
            theme === "light"
              ? "text-slate-600 hover:bg-slate-100"
              : "text-slate-400 hover:bg-slate-800"
          }`}
        >
          <span>
            📦 Archived (
            {chats.filter((chat) => chat.archived).length})
          </span>

          {showArchived ? (
            <ChevronDown size={16} />
          ) : (
            <ChevronRight size={16} />
          )}
        </button>

        {showArchived &&
          chats
            .filter((chat) => chat.archived)
            .map((chat) => (
              <div
                key={chat.id}
                className={`mb-2 flex items-center justify-between rounded-lg p-2 ${
                  theme === "light"
                    ? "bg-slate-100"
                    : "bg-slate-900"
                }`}
              >
                <span
                  className={`truncate text-sm ${
                    theme === "light"
                      ? "text-slate-700"
                      : "text-slate-300"
                  }`}
                >
                  {chat.title}
                </span>

                <button
                  onClick={() => onArchiveChat(chat.id)}
                  className={`rounded-md px-2 py-1 text-xs font-medium transition ${
                    theme === "light"
                      ? "text-slate-900 hover:bg-slate-200"
                      : "text-green-400 hover:bg-slate-800"
                  }`}
                >
                  ♻ Restore
                </button>
              </div>
            ))}
      </div>
    )}

    {/* Settings */}
    <div
      className={`border-t p-3 ${
        theme === "light"
          ? "border-slate-200"
          : "border-slate-800"
      }`}
    >
      <button
        onClick={() => navigate("/settings")}
        className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 transition ${
          theme === "light"
            ? "text-slate-700 hover:bg-slate-100"
            : "text-slate-300 hover:bg-slate-800 hover:text-white"
        }`}
      >
        <Settings size={20} />
        <span>Settings</span>
      </button>
    </div>
  </aside>
);
}

export default ChatSidebar;