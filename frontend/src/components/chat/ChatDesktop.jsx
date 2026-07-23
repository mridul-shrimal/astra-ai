import { Menu } from "lucide-react";

import ChatSidebar from "./ChatSidebar";
import ChatContainer from "./ChatContainer";
import ChatInput from "./ChatInput";
import ExportModal from "./ExportModal";

function ChatDesktop({
  chats,
  currentChat,
  currentChatId,

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
  handleDeleteChat,
  handleRenameChat,

  handleSendMessage,
  handleStopGenerating,
  handleRegenerate,
  handleFeedback,

  handleExportChat,

  setCurrentChatId,
  setExportOpen,
}) {
return (
  <div className="relative flex h-[calc(100vh-80px)] overflow-hidden">
{/* Mobile Overlay */}
<div
  className={`fixed inset-y-0 left-0 z-40 transform transition-transform duration-300 md:static md:translate-x-0 ${
    sidebarOpen ? "translate-x-0" : "-translate-x-full"
  }`}
>
  <ChatSidebar
    chats={chats.filter((chat) => {
      const query = searchQuery.toLowerCase();

      const titleMatch = chat.title.toLowerCase().includes(query);

      const messageMatch = chat.messages.some((msg) =>
        (msg.message || "").toLowerCase().includes(query)
      );

      return titleMatch || messageMatch;
    })}
    currentChatId={currentChatId}
    searchQuery={searchQuery}
    onSearchChange={setSearchQuery}
    onNewChat={handleNewChat}
    onSelectChat={(id) => {
      setCurrentChatId(id);

      if (window.innerWidth < 768) {
        setSidebarOpen(false);
      }
    }}
    onDeleteChat={handleDeleteChat}
    onRenameChat={handleRenameChat}
  />
</div>

    <div className="flex min-w-0 flex-1 flex-col overflow-hidden">

      {/* Header */}
      <div 
      className="flex shrink-0 items-center gap-3 border-b border-slate-800 bg-slate-950 px-4 py-3 md:gap-4 md:px-6 md:py-4">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="rounded-lg p-2 transition hover:bg-slate-800"
        >
          <Menu size={24} className="text-white" />
        </button>

        <div>
          <h1 className="text-xl font-bold text-white md:text-3xl">
            Astra AI
          </h1>

          <p className="hidden text-slate-400 md:block">
            Your intelligent AI assistant
          </p>
        </div>

      </div>

      {/* Chat */}
<div className="flex min-h-0 flex-1 flex-col gap-3 overflow-hidden p-3 md:gap-4 md:p-6">

<ChatContainer
  messages={currentChat.messages}
  isTyping={isTyping}
  isGenerating={isGenerating}
  onStopGenerating={handleStopGenerating}
  onRegenerate={handleRegenerate}
  onFeedback={handleFeedback}
  onExport={() => setExportOpen(true)}
/>
        <ChatInput onSend={handleSendMessage} />

      </div>

    </div>
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
