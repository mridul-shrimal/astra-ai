import { useSettings } from "../../context/SettingsContext";
import { MessageSquare } from "lucide-react";
import SettingsSection from "./SettingsSection";
import { useTheme } from "../../context/ThemeContext";
function ChatSection() {
const {
  fontSize,
  setFontSize,

  exportFormat,
  setExportFormat,

  enterToSend,
  setEnterToSend,

  showTimestamp,
  setShowTimestamp,
} = useSettings();
const { resolvedTheme } = useTheme();

const isLight = resolvedTheme === "light";

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
          className={`w-full rounded-xl border p-3 ${
  isLight
    ? "border-slate-300 bg-white text-slate-900"
    : "border-slate-700 bg-slate-900 text-white"
}`}
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
          className={`w-full rounded-xl border p-3 ${
  isLight
    ? "border-slate-300 bg-white text-slate-900"
    : "border-slate-700 bg-slate-900 text-white"
}`}
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
          className="h-5 w-5 cursor-pointer rounded accent-cyan-500"
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
          className="h-5 w-5 cursor-pointer rounded accent-cyan-500"
        />
      </div>
    </SettingsSection>
  );
}

export default ChatSection;