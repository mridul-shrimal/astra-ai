import { useTheme } from "../../context/ThemeContext";
import { useState, useRef, useEffect } from "react";
import { RotateCcw } from "lucide-react";
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
} from "lucide-react";
import { useNavigate } from "react-router-dom";

function ChatSidebar({
  chats,
  currentChatId,
  searchQuery,
  onSearchChange,
  onNewChat,
  onSelectChat,
  onDeleteChat,
  onRenameChat,
  onPinChat,
  onDuplicateChat,
  onArchiveChat,
}) {
  const [showArchived, setShowArchived] = useState(true);
  const navigate = useNavigate();
const { theme } = useTheme();
const [openMenu, setOpenMenu] = useState(null);
const menuRef = useRef(null);
useEffect(() => {
  function handleClickOutside(event) {
    if (
      menuRef.current &&
      !menuRef.current.contains(event.target)
    ) {
      setOpenMenu(null);
    }
  }

  document.addEventListener("mousedown", handleClickOutside);

  return () =>
    document.removeEventListener(
      "mousedown",
      handleClickOutside
    );
}, []);

  return (
    <aside
  className={`flex h-full w-72 max-w-[85vw] flex-col border-r shadow-xl md:shadow-none ${
    theme === "light"
      ? "bg-white border-slate-200"
      : "bg-slate-950 border-slate-800"
  }`}
>
      {/* New Chat */}
      <div
  className={`sticky top-0 z-10 border-b p-4 ${
    theme === "light"
      ? "bg-white border-slate-200"
      : "bg-slate-950 border-slate-800"
  }`}
>
        <button
          onClick={onNewChat}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-cyan-500 py-3 font-semibold text-white transition hover:bg-cyan-600"
        >
          <MessageSquarePlus size={20} />
          New Chat
        </button>
      </div>

      {/* Search */}
      <div
  className={`border-b px-4 py-4 ${
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
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search chats..."
            className={`w-full rounded-xl border py-3 pl-10 pr-4 outline-none transition focus:border-cyan-500 ${
  theme === "light"
    ? "border-slate-300 bg-white text-slate-900 placeholder:text-slate-500"
    : "border-slate-700 bg-slate-900 text-white placeholder:text-slate-400"
}`}
          />
        </div>
      </div>

      {/* Chats Heading */}
      <div className="px-5 py-3">
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
          Chats
        </p>
      </div>

      {/* Chat List */}
      <div className="flex-1 space-y-2 overflow-y-auto px-3 pb-3">
        {chats.length === 0 ? (
          <div
  className={`flex h-32 items-center justify-center rounded-xl ${
    theme === "light"
      ? "bg-slate-100 text-slate-500"
      : "bg-slate-900 text-slate-400"
  }`}
>
  No chats found
</div>
        ) : (
  [...chats]
  .filter((chat) => !chat.archived)
  .filter((chat) =>
    chat.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
  )
  .sort((a, b) => Number(b.pinned) - Number(a.pinned))
  .map((chat) => (
            <div
              key={chat.id}
              className={`group flex items-center justify-between rounded-xl p-3 transition-all duration-200 ease-out ${
  currentChatId === chat.id
    ? theme === "light"
      ? "bg-cyan-100 shadow-md"
      : "bg-slate-800 shadow-md"
    : theme === "light"
      ? "bg-white hover:bg-slate-100 hover:scale-[1.02]"
      : "bg-slate-900 hover:bg-slate-800 hover:scale-[1.02]"
}`}
            >
              {/* Chat Title */}
              <button
                onClick={() => onSelectChat(chat.id)}
                className="flex flex-1 items-center gap-2 overflow-hidden text-left text-slate-200"
              >
                <div className="flex items-center gap-2">
  <MessageSquare
    size={18}
    className="shrink-0 text-cyan-400"
  />

  {chat.pinned && (
    <span title="Pinned">📌</span>
  )}
</div>
                <span
  className={`truncate text-sm md:text-base ${
    theme === "light"
      ? "text-slate-900"
      : "text-slate-200"
  }`}
>
  {chat.title}
</span>
              </button>

              {/* Actions */}
<div className="relative ml-2">
  <button
    onClick={(e) => {
  e.stopPropagation();
  setOpenMenu((prev) =>
    prev === chat.id ? null : chat.id
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
    className={`absolute right-0 z-50 mt-2 w-56 overflow-hidden rounded-xl border shadow-2xl transition-all duration-200 ease-out ${
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
  className={`flex w-full items-center gap-3 whitespace-nowrap px-4 py-3 text-sm transition ${
    theme === "light"
      ? "text-slate-900 hover:bg-slate-100"
      : "text-slate-200 hover:bg-slate-800"
  }`}
>
  <Pin size={16} />
  <span>{chat.pinned ? "Unpin" : "Pin"}</span>
</button>

      <button
  onClick={() => {
    onDuplicateChat(chat.id);
    setOpenMenu(null);
  }}
  className={`flex w-full items-center gap-3 whitespace-nowrap px-4 py-3 text-sm transition ${
    theme === "light"
      ? "text-slate-900 hover:bg-slate-100"
      : "text-slate-200 hover:bg-slate-800"
  }`}
>
  <Copy size={16} />
  <span>Duplicate</span>
</button>

      <button
  onClick={() => {
    onArchiveChat(chat.id);
    setOpenMenu(null);
  }}
  className={`flex w-full items-center gap-3 whitespace-nowrap px-4 py-3 text-sm transition ${
    theme === "light"
      ? "text-slate-900 hover:bg-slate-100"
      : "text-slate-200 hover:bg-slate-800"
  }`}
>
  <Archive size={16} />
  <span>{chat.archived ? "Restore" : "Archive"}</span>
</button>

      <button
  onClick={() => {
    onRenameChat(chat.id);
    setOpenMenu(null);
  }}
  className={`flex w-full items-center gap-3 whitespace-nowrap px-4 py-3 text-sm transition ${
    theme === "light"
      ? "text-slate-900 hover:bg-slate-100"
      : "text-slate-200 hover:bg-slate-800"
  }`}
>
  <Pencil size={16} />
  <span>Rename</span>
</button>

<hr
  className={`my-1 ${
    theme === "light"
      ? "border-slate-200"
      : "border-slate-700"
  }`}
/>
      <button
  onClick={() => {
    onDeleteChat(chat.id);
    setOpenMenu(null);
  }}
  className={`flex w-full items-center gap-3 whitespace-nowrap px-4 py-3 text-sm transition ${
    theme === "light"
      ? "text-red-600 hover:bg-red-50"
      : "text-red-400 hover:bg-red-900/20"
  }`}
>
  <Trash2 size={16} />
  <span>Delete</span>
</button>
    </div>
  )}
</div>

            </div>
          ))
        )}
      </div>
            {/* Archived Chats */}
      {chats.filter((chat) => chat.archived).length > 0 && (
        <div className="border-t border-slate-800 p-3">
          <button
  onClick={() => setShowArchived(!showArchived)}
  className="mb-2 flex w-full items-center justify-between rounded-lg px-2 py-1 text-xs font-semibold uppercase tracking-wider text-slate-500 transition hover:bg-slate-800"
>
  <span>
    📦 Archived ({chats.filter(chat => chat.archived).length})
  </span>

  <span>
    {showArchived ? "▼" : "▶"}
  </span>
</button>

          {showArchived &&
  chats
    .filter((chat) => chat.archived)
    .filter((chat) =>
      chat.title
        .toLowerCase()
        .includes(searchQuery.toLowerCase())
    )
    .map((chat) => (
              <div
                key={chat.id}
                className={`mb-2 flex items-center justify-between rounded-lg p-2 ${
  theme === "light"
    ? "bg-slate-100"
    : "bg-slate-900"
}`}
              >
                <span className={`truncate text-sm ${
  theme === "light"
    ? "text-slate-900"
    : "text-slate-300"
}`}>
                  {chat.title}
                </span>

                <button
  onClick={() => onArchiveChat(chat.id)}
  className={`flex items-center gap-1 rounded-md px-2 py-1 text-xs transition ${
    theme === "light"
      ? "text-slate-900 hover:bg-slate-200"
      : "text-green-400 hover:bg-slate-800"
  }`}
>
  <RotateCcw size={14} />
  Restore
</button>
              </div>
            ))}
        </div>
      )}

      {/* Bottom Settings */}
      <div className="border-t border-slate-800 p-3">
        <button
          onClick={() => navigate("/settings")}
          className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm transition md:text-base ${
  theme === "light"
    ? "text-slate-700 hover:bg-slate-100 hover:text-slate-900"
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