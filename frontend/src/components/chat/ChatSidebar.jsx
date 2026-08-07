import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import SidebarHeader from "./sidebar/SidebarHeader";
import SearchBar from "./sidebar/SearchBar";
import TagsSection from "./sidebar/TagsSection";
import FolderSection from "./sidebar/FolderSection";
import ChatItem from "./sidebar/ChatItem";
import { useTheme } from "../../context/ThemeContext";

import {
  Settings,
  ChevronDown,
  ChevronRight,
  Search,
} from "lucide-react";

function ChatSidebar({
  // Chat Data
  chats,
  backendConversations,
  folders,
  currentChatId,

  // Search
  searchQuery,
  onSearchChange,
searchRef,
  onRegisterCloseMenus,
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
  console.log(
    "💬 Sidebar Backend Conversations:",
    backendConversations
  );

  const { theme } = useTheme();
  const isLight = theme === "light";
  const navigate = useNavigate();

  const menuRef = useRef(null);


  const [openMenu, setOpenMenu] = useState(null);
  const [moveFolderMenu, setMoveFolderMenu] =
    useState(null);
  const [tagMenu, setTagMenu] = useState(null);
  const [showArchived, setShowArchived] =
    useState(true);

const [dateFilter, setDateFilter] =
  useState("all");
  // =========================
  // Folder Collapse State
  // =========================

  const [collapsedFolders, setCollapsedFolders] =
    useState({});

const [showPinned, setShowPinned] =
  useState(true);

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
// Date Filter
.filter((chat) => {
  if (dateFilter === "all") return true;

  const chatDate = new Date(chat.timestamp);
  const today = new Date();

  if (dateFilter === "today") {
    return (
      chatDate.toDateString() ===
      today.toDateString()
    );
  }

  if (dateFilter === "yesterday") {
    const yesterday = new Date(today);

    yesterday.setDate(today.getDate() - 1);

    return (
      chatDate.toDateString() ===
      yesterday.toDateString()
    );
  }

  if (dateFilter === "week") {
    const weekAgo = new Date(today);

    weekAgo.setDate(today.getDate() - 7);

    return chatDate >= weekAgo;
  }
if (dateFilter === "month") {
  const monthAgo = new Date(today);

  monthAgo.setDate(today.getDate() - 30);

  return chatDate >= monthAgo;
}
  return true;
})
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
  dateFilter,
]);

// =========================
// Pinned Chats
// =========================

const pinnedChats = useMemo(() => {
  return visibleChats.filter((chat) => chat.pinned);
}, [visibleChats]);

const unPinnedChats = useMemo(() => {
  return visibleChats.filter((chat) => !chat.pinned);
}, [visibleChats]);

// =========================
// Archived Chats
// =========================
const archivedChats = useMemo(() => {
  return chats.filter((chat) => {
    if (!chat.archived) return false;

    // Search Filter
    if (
      !chat.title
        .toLowerCase()
        .includes(searchQuery.toLowerCase())
    ) {
      return false;
    }

    // Tag Filter
    if (
      selectedTag !== "All" &&
      !(chat.tags || []).includes(selectedTag)
    ) {
      return false;
    }

    return true;
  });
}, [
  chats,
  searchQuery,
  selectedTag,
]);

// =========================
// Close All Menus
// =========================

const closeAllMenus = () => {
  setOpenMenu(null);
  setMoveFolderMenu(null);
  setTagMenu(null);
};
useEffect(() => {
  onRegisterCloseMenus?.(closeAllMenus);
}, [onRegisterCloseMenus]);
// =========================
// Convert Backend Conversations
// =========================

const backendChats = backendConversations.map(
  (conversation) => ({
    id: conversation.session_id,
    sessionId: conversation.session_id,
    timestamp: new Date(
      conversation.created_at
    ).getTime(),
    title: conversation.title,
    pinned: false,
    archived: false,
    folder: "Uncategorized",
    tags: [],
    locked: false,
    lockPin: "",
    model: null,
    messages: [],
    backendId: conversation.id,
  })
);

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

    const allChats = [
  ...unPinnedChats,
  ...backendChats.filter(
    (backendChat) =>
      !unPinnedChats.some(
        (chat) =>
          chat.sessionId ===
          backendChat.sessionId
      )
  ),
];

allChats.forEach((chat) => {
  
      const folder =
        chat.folder || "Uncategorized";

      if (!groups[folder]) {
        groups[folder] = [];
      }

      groups[folder].push(chat);
    });

    return groups;
  }, [folders, unPinnedChats]);

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
      <SidebarHeader
  onNewChat={onNewChat}
  onCreateFolder={onCreateFolder}
/>
    {/* Search */}
 <div
  className={`border-b p-4 ${
    theme === "light"
      ? "border-slate-200"
      : "border-slate-800"
  }`}
>
  <SearchBar
  ref={searchRef}
  searchQuery={searchQuery}
  onSearchChange={onSearchChange}
/>
</div>

<TagsSection
  tags={tags}
  selectedTag={selectedTag}
  setSelectedTag={setSelectedTag}
/>
<div
  className={`mb-4 rounded-2xl border p-1.5 transition-all ${
    isLight
      ? "border-slate-200 bg-slate-100"
      : "border-slate-800 bg-slate-900/60 backdrop-blur-sm"
  }`}
>
  <div className="grid grid-cols-5 gap-1">
  {[
    { id: "all", label: "All" },
    { id: "today", label: "Today" },
    { id: "yesterday", label: "Yesterday" },
    { id: "week", label: "7 Days" },
{ id: "month", label: "30 Days" },
  ].map((filter) => (
    <button
  key={filter.id}
  onClick={() => setDateFilter(filter.id)}
  className={`rounded-xl px-3 py-2.5 text-xs font-semibold transition-all duration-300 ${
    dateFilter === filter.id
      ? "bg-cyan-500 text-white shadow-lg shadow-cyan-500/30"
      : "text-slate-300 hover:bg-slate-800 hover:text-white"
  }`}
>
  {filter.label}
</button>
  ))}
  </div>
</div>
{/* Chat List */}
<div className="flex-1 overflow-y-auto p-3">
  {visibleChats.length === 0 ? (
    <div className="mt-12 flex flex-col items-center text-center">
      <Search
        size={36}
        className="mb-3 text-slate-500"
      />

      <h3 className="font-medium text-slate-300">
        No chats found
      </h3>

      <p className="mt-2 text-sm text-slate-500">
        Try a different search keyword.
      </p>
    </div>
  ) : (
    <>

      {/* ========================= */}
      {/* Pinned Chats */}
      {/* ========================= */}

      {pinnedChats.length > 0 && (
        <div className="mb-5">
          <button
  onClick={() =>
    setShowPinned(!showPinned)
  }
  className="mb-2 flex w-full items-center justify-between rounded-lg px-2 py-1 text-xs font-semibold uppercase tracking-wider text-cyan-400 transition hover:bg-slate-800"
>
  <span>
    📌 Pinned ({pinnedChats.length})
  </span>

  {showPinned ? (
    <ChevronDown size={16} />
  ) : (
    <ChevronRight size={16} />
  )}
</button>

          {showPinned && (
  <div className="space-y-1">
            {pinnedChats.map((chat) => (
              <ChatItem
                key={chat.id}
                chat={chat}
                folders={folders}
                currentChatId={currentChatId}
                openMenu={openMenu}
                setOpenMenu={setOpenMenu}
                moveFolderMenu={moveFolderMenu}
                setMoveFolderMenu={setMoveFolderMenu}
                tagMenu={tagMenu}
                setTagMenu={setTagMenu}
                menuRef={menuRef}
                onSelectChat={onSelectChat}
                onPinChat={onPinChat}
                onDuplicateChat={onDuplicateChat}
                onArchiveChat={onArchiveChat}
                onToggleLock={onToggleLock}
                onRenameChat={onRenameChat}
                onDeleteChat={onDeleteChat}
                onMoveChatToFolder={onMoveChatToFolder}
                tags={tags}
                onToggleTag={onToggleTag}
                onCreateTag={onCreateTag}
                onDeleteTag={onDeleteTag}
                onRenameTag={onRenameTag}
              />
            ))}
          </div>
          )}
        </div>
      )}

      {/* ========================= */}
      {/* Folder Chats */}
      {/* ========================= */}

      {Object.entries(groupedChats).map(
        ([folder, folderChats]) => (
          <FolderSection
            key={folder}
            folder={folder}
            collapsed={collapsedFolders[folder]}
            toggleFolder={() =>
              toggleFolder(folder)
            }
            onRenameFolder={onRenameFolder}
            onDeleteFolder={onDeleteFolder}
          >
            {folderChats.map((chat) => (
              <ChatItem
                key={chat.id}
                chat={chat}
                folders={folders}
                currentChatId={currentChatId}
                openMenu={openMenu}
                setOpenMenu={setOpenMenu}
                moveFolderMenu={moveFolderMenu}
                setMoveFolderMenu={setMoveFolderMenu}
                tagMenu={tagMenu}
                setTagMenu={setTagMenu}
                menuRef={menuRef}
                onSelectChat={onSelectChat}
                onPinChat={onPinChat}
                onDuplicateChat={onDuplicateChat}
                onArchiveChat={onArchiveChat}
                onToggleLock={onToggleLock}
                onRenameChat={onRenameChat}
                onDeleteChat={onDeleteChat}
                onMoveChatToFolder={onMoveChatToFolder}
                tags={tags}
                onToggleTag={onToggleTag}
                onCreateTag={onCreateTag}
                onDeleteTag={onDeleteTag}
                onRenameTag={onRenameTag}
              />
            ))}
          </FolderSection>
        )
      )}
    </>
  )}
</div>
    {/* Archived Chats */}
{archivedChats.length > 0 && (
  <div
    className={`border-t p-3 ${
      theme === "light"
        ? "border-slate-200"
        : "border-slate-800"
    }`}
  >
    <button
      onClick={() =>
        setShowArchived(!showArchived)
      }
      className={`mb-2 flex w-full items-center justify-between rounded-xl px-2 py-2 text-xs font-semibold uppercase tracking-wider transition ${
        theme === "light"
          ? "text-slate-600 hover:bg-slate-100"
          : "text-slate-400 hover:bg-slate-800"
      }`}
    >
      <span>
        📦 Archived ({archivedChats.length})
      </span>

      {showArchived ? (
        <ChevronDown size={16} />
      ) : (
        <ChevronRight size={16} />
      )}
    </button>

    {showArchived && (
      <div className="space-y-1">
        {archivedChats.map((chat) => (
          <div
            key={chat.id}
            className={`flex items-center justify-between rounded-xl px-3 py-2 transition ${
              theme === "light"
                ? "bg-slate-100 hover:bg-slate-200"
                : "bg-slate-900 hover:bg-slate-800"
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
              onClick={() =>
                onArchiveChat(chat.id)
              }
              className="rounded-lg px-2 py-1 text-xs font-medium text-green-400 transition hover:bg-slate-700"
            >
              ♻ Restore
            </button>
          </div>
        ))}
      </div>
    )}
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