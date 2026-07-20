function ChatSidebar({
  chats,
  currentChatId,
  onNewChat,
  onSelectChat,
}) {
  return (
    <aside className="w-72 bg-slate-950 border-r border-slate-800 flex flex-col">
      <div className="p-4 border-b border-slate-800">
        <button
          onClick={onNewChat}
          className="w-full rounded-xl bg-cyan-500 py-3 font-semibold text-white hover:bg-cyan-600 transition"
        >
          + New Chat
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        {chats.map((chat) => (
          <button
            key={chat.id}
            onClick={() => onSelectChat(chat.id)}
            className={`w-full rounded-lg p-3 text-left transition ${
              currentChatId === chat.id
                ? "bg-slate-800 text-white"
                : "bg-slate-900 text-slate-300 hover:bg-slate-800"
            }`}
          >
            💬 {chat.title}
          </button>
        ))}
      </div>
    </aside>
  );
}

export default ChatSidebar;