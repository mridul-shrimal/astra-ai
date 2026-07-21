import { useRef, useState } from "react";
import {
  Paperclip,
  Send,
  X,
  FileText,
  FileSpreadsheet,
  FileImage,
} from "lucide-react";

function ChatInput({ onSend }) {
  const [input, setInput] = useState("");
  const [selectedFiles, setSelectedFiles] = useState([]);

  const fileInputRef = useRef(null);

const handleSend = () => {
  if (!input.trim() && !selectedFiles) return;

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
    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-4">
      {selectedFiles.length > 0 && (
  <div className="mb-3 space-y-2">
    {selectedFiles.map((file, index) => (
      <div
        key={index}
        className="flex items-center justify-between rounded-xl bg-slate-800 px-4 py-3"
      >
        <div>
          <div className="font-medium text-white">
            <div className="flex items-center gap-2">
  {getFileIcon(file)}
  <span>{file.name}</span>
</div>
          </div>

          <div className="text-xs text-slate-400">
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

        <button
          onClick={() => fileInputRef.current?.click()}
          className="rounded-xl bg-slate-800 p-3 transition hover:bg-slate-700"
          title="Attach File"
        >
          <Paperclip size={20} className="text-cyan-400" />
        </button>

        <input
          type="text"
          placeholder="Ask Astra anything..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          className="flex-1 rounded-xl bg-slate-800 px-4 py-3 text-white outline-none placeholder:text-slate-400"
        />

        <button
          onClick={handleSend}
          className="rounded-xl bg-cyan-500 p-3 transition hover:bg-cyan-600"
        >
          <Send size={20} className="text-white" />
        </button>
      </div>
    </div>
  );
}

export default ChatInput;