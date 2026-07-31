import { useEffect, useState } from "react";
import { MessageSquare } from "lucide-react";
import SettingsSection from "./SettingsSection";

function ChatSection() {
  const [fontSize, setFontSize] = useState("medium");
  const [exportFormat, setExportFormat] = useState("pdf");
  const [enterToSend, setEnterToSend] = useState(true);
  const [showTimestamp, setShowTimestamp] = useState(true);

  useEffect(() => {
    const saved =
      JSON.parse(localStorage.getItem("astra-settings")) || {};

    setFontSize(saved.fontSize || "medium");
    setExportFormat(saved.exportFormat || "pdf");
    setEnterToSend(saved.enterToSend ?? true);
    setShowTimestamp(saved.showTimestamp ?? true);
  }, []);

  useEffect(() => {
    const saved =
      JSON.parse(localStorage.getItem("astra-settings")) || {};

    localStorage.setItem(
      "astra-settings",
      JSON.stringify({
        ...saved,
        fontSize,
        exportFormat,
        enterToSend,
        showTimestamp,
      })
    );
  }, [
    fontSize,
    exportFormat,
    enterToSend,
    showTimestamp,
  ]);

  return (
    <SettingsSection
      icon={MessageSquare}
      title="Chat Preferences"
      description="Customize how conversations behave."
    >
      {/* Font Size */}

      <div>
        <label className="mb-2 block font-medium">
          Font Size
        </label>

        <select
          value={fontSize}
          onChange={(e) => setFontSize(e.target.value)}
          className="w-full rounded-xl border border-slate-700 bg-slate-900 p-3"
        >
          <option value="small">Small</option>
          <option value="medium">Medium</option>
          <option value="large">Large</option>
        </select>
      </div>

      {/* Export */}

      <div>
        <label className="mb-2 block font-medium">
          Default Export Format
        </label>

        <select
          value={exportFormat}
          onChange={(e) =>
            setExportFormat(e.target.value)
          }
          className="w-full rounded-xl border border-slate-700 bg-slate-900 p-3"
        >
          <option value="pdf">PDF</option>
          <option value="txt">TXT</option>
          <option value="html">HTML</option>
          <option value="md">Markdown</option>
          <option value="json">JSON</option>
        </select>
      </div>

      {/* Toggles */}

      <div className="flex items-center justify-between rounded-xl border border-slate-700 p-4">
        <div>
          <h3 className="font-medium">
            Press Enter to Send
          </h3>

          <p className="text-sm text-slate-400">
            Send messages using Enter.
          </p>
        </div>

        <input
          type="checkbox"
          checked={enterToSend}
          onChange={(e) =>
            setEnterToSend(e.target.checked)
          }
          className="h-5 w-5"
        />
      </div>

      <div className="flex items-center justify-between rounded-xl border border-slate-700 p-4">
        <div>
          <h3 className="font-medium">
            Show Timestamps
          </h3>

          <p className="text-sm text-slate-400">
            Display message timestamps.
          </p>
        </div>

        <input
          type="checkbox"
          checked={showTimestamp}
          onChange={(e) =>
            setShowTimestamp(e.target.checked)
          }
          className="h-5 w-5"
        />
      </div>
    </SettingsSection>
  );
}

export default ChatSection;