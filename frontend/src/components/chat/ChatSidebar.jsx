import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import SidebarHeader from "./sidebar/SidebarHeader";
import SearchBar from "./sidebar/SearchBar";
import TagsSection from "./sidebar/TagsSection";
import FolderSection from "./sidebar/FolderSection";
import { useTheme } from "../../context/ThemeContext";

import {
  Settings,
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
  searchQuery={searchQuery}
  onSearchChange={onSearchChange}
/>
    </div>

<TagsSection
  tags={tags}
  selectedTag={selectedTag}
  setSelectedTag={setSelectedTag}
/>

 {/* Chat List */}
<div className="flex-1 overflow-y-auto p-3">
  {Object.entries(groupedChats).map(([folder, folderChats]) => (
    <FolderSection
      key={folder}
      folder={folder}
      folderChats={folderChats}
      folders={folders}
      currentChatId={currentChatId}
      collapsedFolders={collapsedFolders}
      toggleFolder={toggleFolder}
      theme={theme}
      openMenu={openMenu}
      setOpenMenu={setOpenMenu}
      moveFolderMenu={moveFolderMenu}
      setMoveFolderMenu={setMoveFolderMenu}
      tagMenu={tagMenu}
      setTagMenu={setTagMenu}
      menuRef={menuRef}
      onSelectChat={onSelectChat}
      onRenameFolder={onRenameFolder}
      onDeleteFolder={onDeleteFolder}
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