import { Menu } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";
import ChatSidebar from "./ChatSidebar";
import ChatContainer from "./ChatContainer";
import ChatInput from "./ChatInput";
import ExportModal from "./ExportModal";
import { useRef, useState } from "react";
import useKeyboardShortcuts from "../../hooks/useKeyboardShortcuts";
import FavoritesModal from "./FavoritesModal";

function ChatDesktop({
  chats,
  folders,
  currentChat,
  currentChatId,
  statsOpen,
  onOpenStats,
  onCloseStats,

  favoritesOpen,
onOpenFavorites,
onCloseFavorites,

  sidebarOpen,
  setSidebarOpen,

  searchQuery,
  setSearchQuery,

  exportOpen,
  selectedFormat,
  setSelectedFormat,

  isTyping,
  isGenerating,

  handleNewChat,
  handleCreateFolder,
  handleDeleteChat,
  handleRenameChat,
  handlePinChat,
  handleDeleteFolder,
  handleCreateTag,
  tags,
  onToggleTag,
   handleRenameFolder,
  handleMoveChatToFolder,
  handleDuplicateChat,
  handleArchiveChat,
  handleSendMessage,
  handleStopGenerating,
  handleRegenerate,
  handleFeedback,
  handleFavoriteMessage,
   
  handleExportChat,

  setCurrentChatId,
  setExportOpen,
}) {
  const inputRef = useRef(null);
  const [showScrollButton, setShowScrollButton] = useState(false);
  useKeyboardShortcuts({
  onNewChat: handleNewChat,
  inputRef,
});
  const { theme } = useTheme();

return (
  <div
    className={`relative flex h-[calc(100vh-80px)] overflow-hidden transition-colors duration-300 ${
      theme === "light" ? "bg-slate-100" : "bg-slate-950"
    }`}
  >
    {/* Mobile Sidebar */}
    <div
      className={`fixed inset-y-0 left-0 z-40 transform transition-transform duration-300 md:static md:translate-x-0 ${
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      <ChatSidebar
  chats={chats}
  folders={folders}
  currentChatId={currentChatId}
  searchQuery={searchQuery}
  onSearchChange={setSearchQuery}
  onNewChat={handleNewChat}
  onCreateFolder={handleCreateFolder}
  onDeleteFolder={handleDeleteFolder}
   onCreateTag={handleCreateTag}
   tags={tags}
   onToggleTag={onToggleTag}
  onRenameFolder={handleRenameFolder}
  onMoveChatToFolder={handleMoveChatToFolder}
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

    {/* Main Content */}
    <div className="flex min-w-0 flex-1 flex-col overflow-hidden">

      {/* Header */}
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
              onClick={() => setExportOpen(true)}
              className="rounded-lg bg-cyan-500 px-3 py-2 text-white transition hover:bg-cyan-600"
              title="Export Chat"
            >
              📤
            </button>

          </div>

        </div>
      </div>

      {/* Chat Area */}
      <div className="relative flex min-h-0 flex-1 flex-col gap-3 overflow-hidden p-3 md:gap-4 md:p-6">

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
          setShowScrollButton={setShowScrollButton}
        />
{showScrollButton && (
  <div className="pointer-events-none absolute bottom-24 left-1/2 z-30 -translate-x-1/2">
    <button
  onClick={() => {
    const container = document.getElementById("chat-export");

    container?.scrollTo({
      top: container.scrollHeight,
      behavior: "smooth",
    });
  }}
  className={`pointer-events-auto flex h-11 w-11 items-center justify-center rounded-full border shadow-xl transition-all duration-200 hover:scale-110 ${
    theme === "light"
      ? "border-slate-300 bg-white text-slate-700"
      : "border-slate-700 bg-slate-800 text-white"
  }`}
  title="Scroll to bottom"
>
  ↓
</button>
  </div>
)}
        <ChatInput
          onSend={handleSendMessage}
          inputRef={inputRef}
        />

      </div>

    </div>
<FavoritesModal
  open={favoritesOpen}
  onClose={onCloseFavorites}
  messages={currentChat.messages}
  onSelectMessage={(messageId) => {
    const element = document.getElementById(
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
    <ExportModal
      open={exportOpen}
      selectedFormat={selectedFormat}
      setSelectedFormat={setSelectedFormat}
      onClose={() => setExportOpen(false)}
      onExport={handleExportChat}
    />

  </div>
);
}

export default ChatDesktop;
