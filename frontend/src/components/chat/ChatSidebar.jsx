function ChatSidebar({
  chats,
  currentChatId,
  onNewChat,
  onSelectChat,
  onDeleteChat,
  onRenameChat,
}) {
  return (
    <aside className="w-72 border-r border-slate-800 bg-slate-950 flex flex-col">
      {/* New Chat */}
      <div className="p-4">
        <button
          onClick={onNewChat}
          className="w-full rounded-xl bg-cyan-500 py-3 font-semibold text-white hover:bg-cyan-600 transition"
        >
          + New Chat
        </button>
      </div>

      {/* Chat List */}
      <div className="flex-1 overflow-y-auto px-3 pb-3 space-y-2">
        {chats.map((chat) => (
          <div
            key={chat.id}
            className={`group flex items-center justify-between rounded-lg p-3 transition ${
              currentChatId === chat.id
                ? "bg-slate-800"
                : "bg-slate-900 hover:bg-slate-800"
            }`}
          >
            {/* Chat Title */}
            <button
              onClick={() => onSelectChat(chat.id)}
              className="flex-1 text-left text-slate-200 truncate"
            >
              💬 {chat.title}
            </button>

            {/* Actions */}
            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition">
              <button
                onClick={() => onRenameChat(chat.id)}
                className="text-yellow-400 hover:text-yellow-300"
                title="Rename"
              >
                ✏️
              </button>

              <button
                onClick={() => onDeleteChat(chat.id)}
                className="text-red-400 hover:text-red-300"
                title="Delete"
              >
                🗑
              </button>
            </div>
          </div>
        ))}
      </div>
    </aside>
  );
}

export default ChatSidebar;