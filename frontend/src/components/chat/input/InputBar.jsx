import { Paperclip, Send } from "lucide-react";

function InputBar({
  input,
  setInput,
  handleSend,
  handleKeyDown,
  fileInputRef,
  handleFileChange,
  inputRef,
  isLight,
}) {
  return (
    <div className="flex items-center gap-3">
      <input
        ref={fileInputRef}
        type="file"
        multiple
        className="hidden"
        onChange={handleFileChange}
      />

      <div
        className={`flex flex-1 items-center rounded-2xl border px-3 transition-all duration-200 focus-within:border-cyan-500 focus-within:ring-2 focus-within:ring-cyan-500/30 ${
          isLight
            ? "border-slate-300 bg-slate-50"
            : "border-slate-700 bg-slate-800"
        }`}
      >
        {/* Attach Button */}

        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className={`mr-2 rounded-lg p-2 transition ${
            isLight
              ? "text-cyan-600 hover:bg-slate-200"
              : "text-cyan-400 hover:bg-slate-700"
          }`}
          title="Attach File"
        >
          <Paperclip size={18} />
        </button>

        {/* Message Input */}

        <input
          ref={inputRef}
          type="text"
          placeholder="Message Astra..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          className={`min-w-0 flex-1 bg-transparent py-4 text-sm outline-none sm:text-base ${
            isLight
              ? "text-slate-900 placeholder:text-slate-500"
              : "text-white placeholder:text-slate-400"
          }`}
        />
      </div>

      {/* Send Button */}

      <button
        onClick={handleSend}
        className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl transition-all duration-200 hover:scale-105 active:scale-95 ${
          isLight
            ? "bg-cyan-600 shadow-md hover:bg-cyan-700"
            : "bg-cyan-500 hover:bg-cyan-600"
        }`}
      >
        <Send
          size={20}
          className="text-white"
        />
      </button>
    </div>
  );
}

export default InputBar;