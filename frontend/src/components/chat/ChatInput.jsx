import { useRef, useState } from "react";
import { useTheme } from "../../context/ThemeContext";
import {
  Paperclip,
  Send,
  X,
  FileText,
  FileSpreadsheet,
  FileImage,
} from "lucide-react";

function ChatInput({ onSend }) {
  const { theme } = useTheme();
const isLight = theme === "light";
  const [input, setInput] = useState("");
  const [selectedFiles, setSelectedFiles] = useState([]);

  const fileInputRef = useRef(null);

const handleSend = () => {
  if (!input.trim() && selectedFiles.length === 0) return;

  onSend(input, selectedFiles);

  setInput("");
  setSelectedFiles([]);

  if (fileInputRef.current) {
    fileInputRef.current.value = "";
  }
};
  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      handleSend();
    }
  };

  const handleFileChange = (e) => {
  const files = Array.from(e.target.files);

  if (!files.length) return;

  setSelectedFiles((prev) => [...prev, ...files]);
};

  const removeFile = (index) => {
  setSelectedFiles((prev) =>
    prev.filter((_, i) => i !== index)
  );

  if (fileInputRef.current) {
    fileInputRef.current.value = "";
  }
};
const getFileIcon = (file) => {
  const ext = file.name.split(".").pop().toLowerCase();

  if (["png", "jpg", "jpeg", "gif", "webp"].includes(ext))
    return <FileImage size={22} className="text-green-400" />;

  if (["csv", "xlsx", "xls"].includes(ext))
    return <FileSpreadsheet size={22} className="text-emerald-400" />;

  return <FileText size={22} className="text-red-400" />;
};
  return (
    <div
  className={`rounded-xl border p-3 transition-all duration-300 sm:rounded-2xl sm:p-4 ${
    isLight
      ? "border-slate-200 bg-white shadow-sm"
      : "border-slate-800 bg-slate-900"
  }`}
>
      {selectedFiles.length > 0 && (
  <div className="mb-3 space-y-2">
    {selectedFiles.map((file, index) => (
      <div
        key={index}
        className={`flex items-start justify-between gap-3 rounded-xl px-3 py-3 transition sm:items-center sm:px-4 ${
  isLight
    ? "bg-slate-100"
    : "bg-slate-800"
}`}
      >
        <div>
          <div className={`font-medium ${
  isLight ? "text-slate-900" : "text-white"
}`}>
            <div className="flex items-center gap-2">
  {getFileIcon(file)}
  <span className="truncate break-all">
  {file.name}
</span>
</div>
          </div>

          <div className={`text-xs ${
  isLight ? "text-slate-500" : "text-slate-400"
}`}>
            {(file.size / 1024).toFixed(1)} KB
          </div>
        </div>

        <button
          onClick={() => removeFile(index)}
          className="text-red-400 hover:text-red-300"
        >
          <X size={18} />
        </button>
      </div>
    ))}
  </div>
)}

      <div className="flex items-center gap-3">
        <input
          ref={fileInputRef}
          type="file"
multiple
          className="hidden"
          onChange={handleFileChange}
        />

        <div className={`flex flex-1 items-center rounded-2xl border px-3 transition-all duration-200 focus-within:border-cyan-500 focus-within:ring-2 focus-within:ring-cyan-500/30 ${
  isLight
    ? "border-slate-300 bg-slate-50"
    : "border-slate-700 bg-slate-800"
}`}>
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

  <input
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

        <button
          onClick={handleSend}
          className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl transition-all duration-200 hover:scale-105 active:scale-95 ${
  isLight
    ? "bg-cyan-600 shadow-md hover:bg-cyan-700"
    : "bg-cyan-500 hover:bg-cyan-600"
}`}
        >
          <Send size={20} className="text-white" />
        </button>
      </div>
    </div>
  );
}

export default ChatInput;