import { useRef, useState } from "react";
import { Paperclip, Send, X } from "lucide-react";

function ChatInput({ onSend }) {
  const [input, setInput] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);

  const fileInputRef = useRef(null);

const handleSend = async () => {
  if (!input.trim() && !selectedFile) return;

  let uploadedFile = null;

  if (selectedFile) {
    const formData = new FormData();

    formData.append("file", selectedFile);

    try {
      const response = await fetch(
        "http://localhost:5000/api/upload",
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();

      console.log("Uploaded:", data);

      uploadedFile = data.file;
    } catch (error) {
      console.error("Upload failed:", error);
      return;
    }
  }

  onSend(input, uploadedFile);

  setInput("");
  setSelectedFile(null);

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
    const file = e.target.files[0];

    if (!file) return;

    setSelectedFile(file);
  };

  const removeFile = () => {
    setSelectedFile(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-4">
      {selectedFile && (
        <div className="mb-3 flex items-center justify-between rounded-xl bg-slate-800 px-4 py-3">
          <span className="truncate text-sm text-white">
            📄 {selectedFile.name}
          </span>

          <button
            onClick={removeFile}
            className="text-red-400 hover:text-red-300"
          >
            <X size={18} />
          </button>
        </div>
      )}

      <div className="flex items-center gap-3">
        <input
          ref={fileInputRef}
          type="file"
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