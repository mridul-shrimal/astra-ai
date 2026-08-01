import { useRef, useState } from "react";
import { useTheme } from "../../context/ThemeContext";
import SelectedFiles from "./input/SelectedFiles";
import InputBar from "./input/InputBar";


function ChatInput({ onSend, inputRef }) {
  // =========================
  // Theme
  // =========================

  const { theme } = useTheme();
  const isLight = theme === "light";

  // =========================
  // State
  // =========================

  const [input, setInput] = useState("");
  const [selectedFiles, setSelectedFiles] = useState([]);

  // =========================
  // Refs
  // =========================

  const fileInputRef = useRef(null);

  // =========================
  // Send Message
  // =========================

  const handleSend = () => {
    if (!input.trim() && selectedFiles.length === 0) return;

    onSend(input, selectedFiles);

    setInput("");
    setSelectedFiles([]);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // =========================
  // Enter Key
  // =========================

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      handleSend();
    }
  };

  // =========================
  // File Selection
  // =========================

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);

    if (!files.length) return;

    setSelectedFiles((prev) => [...prev, ...files]);
  };

  // =========================
  // Remove Selected File
  // =========================

  const removeFile = (index) => {
    setSelectedFiles((prev) =>
      prev.filter((_, i) => i !== index)
    );

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div
      className={`rounded-xl border p-3 transition-all duration-300 sm:rounded-2xl sm:p-4 ${
        isLight
          ? "border-slate-200 bg-white shadow-sm"
          : "border-slate-800 bg-slate-900"
      }`}
    >
      <SelectedFiles
  selectedFiles={selectedFiles}
  removeFile={removeFile}
  isLight={isLight}
/>

     <InputBar
  input={input}
  setInput={setInput}
  handleSend={handleSend}
  handleKeyDown={handleKeyDown}
  fileInputRef={fileInputRef}
  handleFileChange={handleFileChange}
  inputRef={inputRef}
  isLight={isLight}
/>
    </div>
  );
}

export default ChatInput;