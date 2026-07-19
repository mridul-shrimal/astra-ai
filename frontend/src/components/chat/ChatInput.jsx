import { Send } from "lucide-react";

function ChatInput() {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-slate-800 bg-slate-900 p-4">

      <input
        type="text"
        placeholder="Ask Astra anything..."
        className="flex-1 rounded-xl bg-slate-800 px-4 py-3 text-white outline-none placeholder:text-slate-400"
      />

      <button
        className="rounded-xl bg-cyan-500 p-3 transition hover:bg-cyan-600"
      >
        <Send size={20} className="text-white" />
      </button>

    </div>
  );
}

export default ChatInput;