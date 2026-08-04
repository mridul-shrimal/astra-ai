import { useRef, useState } from "react";
import { useTheme } from "../../context/ThemeContext";
import DesktopHeader from "./desktop/DesktopHeader";
import ChatSidebar from "./ChatSidebar";
import ChatContainer from "./ChatContainer";
import ChatInput from "./ChatInput";
import ExportModal from "./ExportModal";
import FavoritesModal from "./FavoritesModal";
import ModelSelector from "./desktop/ModelSelector";
import useKeyboardShortcuts from "../../hooks/useKeyboardShortcuts";
import ScrollToBottomButton from "./desktop/ScrollToBottomButton";
import KeyboardShortcutsModal from "../modals/KeyboardShortcutsModal";
function ChatDesktop({
  // Chat Data
  chats,
  folders,
  currentChat,
  currentChatId,

  // Statistics
  statsOpen,
  onOpenStats,
  onCloseStats,

  // Favorites
  favoritesOpen,
  onOpenFavorites,
  onCloseFavorites,

  // Sidebar
  sidebarOpen,
  setSidebarOpen,
onToggleSidebar,
  // Search
  searchQuery,
  setSearchQuery,

  // Export
  exportOpen,
  selectedFormat,
  setSelectedFormat,
  handleExportChat,
  setExportOpen,

  // AI Status
  isTyping,
  isGenerating,

  // Models
  selectedModel,
  setSelectedModel,
  handleModelChange,

  // Chat Actions
  handleNewChat,
  handleDeleteChat,
  handleRenameChat,
  handlePinChat,
  handleDuplicateChat,
  handleArchiveChat,
  handleSendMessage,
  handleStopGenerating,
  handleRegenerate,
  handleFeedback,
  handleFavoriteMessage,

  // Folder Actions
  handleCreateFolder,
  handleDeleteFolder,
  handleRenameFolder,
  handleMoveChatToFolder,

  // Tag Actions
  handleCreateTag,
  tags,
  selectedTag,
  setSelectedTag,
  onToggleTag,
  onDeleteTag,
  onRenameTag,
  onToggleLock,

  // Navigation
  setCurrentChatId,
}) {
  const { theme } = useTheme();

  const inputRef = useRef(null);

  const [showScrollButton, setShowScrollButton] =
    useState(false);
    const [shortcutsOpen, setShortcutsOpen] =
  useState(false);
const searchRef = useRef(null);
const closeMenusRef = useRef(() => {});
  useKeyboardShortcuts({
  onNewChat: handleNewChat,
  inputRef,
  searchRef,
  onToggleSidebar,
   onCloseShortcuts: () => setShortcutsOpen(false),
 onOpenShortcuts: () => setShortcutsOpen(true),
  onExportChat: () => setExportOpen(true),

  onCloseMenus: () => closeMenusRef.current(),
});
  return (
    <div
      className={`relative flex h-[calc(100vh-80px)] overflow-hidden transition-colors duration-300 ${
        theme === "light"
          ? "bg-slate-100"
          : "bg-slate-950"
      }`}
    >
      {/* =========================
          Mobile Sidebar
      ========================= */}

      <div
  className={`fixed inset-y-0 left-0 z-40 transition-all duration-300 md:relative ${
    sidebarOpen
      ? "translate-x-0 w-72"
      : "-translate-x-full md:translate-x-0 w-0 overflow-hidden"
  }`}
>
        <ChatSidebar
          chats={chats}
          folders={folders}
          searchRef={searchRef}
          currentChatId={currentChatId}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onNewChat={handleNewChat}
          onCreateFolder={handleCreateFolder}
          onDeleteFolder={handleDeleteFolder}
          onRenameFolder={handleRenameFolder}
          onMoveChatToFolder={handleMoveChatToFolder}
          onCreateTag={handleCreateTag}
          tags={tags}
           onRegisterCloseMenus={(fn) => {
    closeMenusRef.current = fn;
  }}
          selectedTag={selectedTag}
          setSelectedTag={setSelectedTag}
          onToggleTag={onToggleTag}
          onDeleteTag={onDeleteTag}
          onRenameTag={onRenameTag}
          onToggleLock={onToggleLock}
          onSelectChat={(id) => {
            setCurrentChatId(id);

            if (window.innerWidth < 768) {
              setSidebarOpen(false);
            }
          }}
          onDeleteChat={handleDeleteChat}
          onRenameChat={handleRenameChat}
          onPinChat={handlePinChat}
          onDuplicateChat={handleDuplicateChat}
          onArchiveChat={handleArchiveChat}
        />
      </div>

          {/* =========================
          Main Content
      ========================= */}
<div className="flex min-w-0 flex-1 flex-col">

      <DesktopHeader
  sidebarOpen={sidebarOpen}
  setSidebarOpen={setSidebarOpen}
  onOpenStats={onOpenStats}
  onOpenFavorites={onOpenFavorites}
  setExportOpen={setExportOpen}
  onOpenShortcuts={() => setShortcutsOpen(true)}
/>

        {/* =========================
            Chat Area
        ========================= */}

        <div className="relative flex min-h-0 flex-1 flex-col gap-3 overflow-hidden p-3 md:gap-4 md:p-6">

          <ModelSelector
  selectedModel={selectedModel}
  setSelectedModel={setSelectedModel}
  handleModelChange={handleModelChange}
/>

          {/* =========================
              Chat Messages
          ========================= */}

          <ChatContainer
            messages={currentChat.messages}
            isTyping={isTyping}
            isGenerating={isGenerating}
            onStopGenerating={handleStopGenerating}
            onRegenerate={handleRegenerate}
            onFeedback={handleFeedback}
            onFavorite={handleFavoriteMessage}
            onExport={() => setExportOpen(true)}
            statsOpen={statsOpen}
            onOpenStats={onOpenStats}
            onCloseStats={onCloseStats}
            setShowScrollButton={
              setShowScrollButton
            }
          />

          <ScrollToBottomButton
  showScrollButton={showScrollButton}
/>

          {/* Chat Input */}

          <ChatInput
            onSend={handleSendMessage}
            inputRef={inputRef}
          />

        </div>

      </div>

      {/* =========================
          Favorites Modal
      ========================= */}

      <FavoritesModal
        open={favoritesOpen}
        onClose={onCloseFavorites}
        messages={currentChat.messages}
        onSelectMessage={(messageId) => {
          const element =
            document.getElementById(
              `message-${messageId}`
            );

          if (element) {
            element.scrollIntoView({
              behavior: "smooth",
              block: "center",
            });
          }
        }}
      />

      {/* =========================
          Export Modal
      ========================= */}

      <ExportModal
        open={exportOpen}
        selectedFormat={selectedFormat}
        setSelectedFormat={setSelectedFormat}
        onClose={() =>
          setExportOpen(false)
        }
        onExport={handleExportChat}
      />
<KeyboardShortcutsModal
  open={shortcutsOpen}
  onClose={() => setShortcutsOpen(false)}
/>
    </div>
  );
}

export default ChatDesktop;