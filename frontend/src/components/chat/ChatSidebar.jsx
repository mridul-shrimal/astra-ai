import {
  Search,
  MessageSquare,
  MessageSquarePlus,
  Settings,
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
}) {
  const navigate = useNavigate();

  return (
    <aside className="flex h-full w-72 max-w-[85vw] flex-col border-r border-slate-800 bg-slate-950 shadow-xl md:shadow-none">
      {/* New Chat */}
      <div className="sticky top-0 z-10 border-b border-slate-800 bg-slate-950 p-4">
        <button
          onClick={onNewChat}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-cyan-500 py-3 font-semibold text-white transition hover:bg-cyan-600"
        >
          <MessageSquarePlus size={20} />
          New Chat
        </button>
      </div>

      {/* Search */}
      <div className="border-b border-slate-800 px-4 py-4">
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
            className="w-full rounded-xl border border-slate-700 bg-slate-900 py-3 pl-10 pr-4 text-white placeholder:text-slate-400 outline-none transition focus:border-cyan-500"
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
          <div className="flex h-32 items-center justify-center rounded-xl bg-slate-900 text-slate-400">
            No chats found
          </div>
        ) : (
          chats.map((chat) => (
            <div
              key={chat.id}
              className={`group flex items-center justify-between rounded-xl p-3 transition-all duration-200 ${
                currentChatId === chat.id
                  ? "bg-slate-800 shadow-md"
                  : "bg-slate-900 hover:bg-slate-800 hover:scale-[1.02]"
              }`}
            >
              {/* Chat Title */}
              <button
                onClick={() => onSelectChat(chat.id)}
                className="flex flex-1 items-center gap-2 overflow-hidden text-left text-slate-200"
              >
                <MessageSquare
                  size={18}
                  className="shrink-0 text-cyan-400"
                />

                <span className="truncate text-sm md:text-base">
  {chat.title}
</span>
              </button>

              {/* Actions */}
              <div className="ml-2 flex gap-2 opacity-0 transition group-hover:opacity-100">
                <button
                  onClick={() => onRenameChat(chat.id)}
                  className="rounded-md p-1 text-yellow-400 hover:bg-slate-700 hover:text-yellow-300"
                  title="Rename"
                >
                  ✏️
                </button>

                <button
                  onClick={() => onDeleteChat(chat.id)}
                  className="rounded-md p-1 text-red-400 hover:bg-slate-700 hover:text-red-300"
                  title="Delete"
                >
                  🗑️
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Bottom Settings */}
      <div className="border-t border-slate-800 p-3">
        <button
          onClick={() => navigate("/settings")}
          className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm text-slate-300 transition hover:bg-slate-800 hover:text-white md:text-base"
        >
          <Settings size={20} />
          <span>Settings</span>
        </button>
      </div>
    </aside>
  );
}

export default ChatSidebar;