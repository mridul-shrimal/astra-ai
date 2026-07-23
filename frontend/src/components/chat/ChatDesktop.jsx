import { Menu } from "lucide-react";

import ChatSidebar from "./ChatSidebar";
import ChatContainer from "./ChatContainer";
import ChatInput from "./ChatInput";
import ExportModal from "./ExportModal";

function ChatDesktop({
  chats,
   searchResults,
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
  <div className="flex h-[calc(100vh-140px)] overflow-hidden">

    {sidebarOpen && (
      <ChatSidebar
        chats={chats.filter((chat) => {
  console.log("Checking Chat:", chat.title);

  const query = searchQuery.toLowerCase();

  const titleMatch = chat.title
    .toLowerCase()
    .includes(query);

  const messageMatch = chat.messages.some((msg) => {
    console.log("Message:", msg.message);

    return (msg.message || "")
      .toLowerCase()
      .includes(query);
  });

  console.log({
    titleMatch,
    messageMatch,
  });

  return titleMatch || messageMatch;
})}
        currentChatId={currentChatId}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onNewChat={handleNewChat}
        onSelectChat={setCurrentChatId}
        onDeleteChat={handleDeleteChat}
        onRenameChat={handleRenameChat}
      />
    )}

    <div className="flex min-h-0 flex-1 flex-col">

      {/* Header */}
      <div className="flex items-center gap-4 border-b border-slate-800 bg-slate-950 px-6 py-4">

        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="rounded-lg p-2 transition hover:bg-slate-800"
        >
          <Menu size={24} className="text-white" />
        </button>

        <div>
          <h1 className="text-3xl font-bold text-white">
            Astra AI
          </h1>

          <p className="text-slate-400">
            Your intelligent AI assistant
          </p>
        </div>

      </div>

      {/* Chat */}
<div className="flex min-h-0 flex-1 flex-col gap-4 p-6">

<ChatContainer
  messages={currentChat.messages}
  searchQuery={searchQuery}
  matchedMessages={
    searchResults.find(
      (result) => result.chat.id === currentChat.id
    )?.matchedMessages || []
  }
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
