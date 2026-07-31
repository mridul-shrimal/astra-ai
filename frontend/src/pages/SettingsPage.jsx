import {
  Settings,
  Moon,
  Sun,
  Monitor,
  Volume2,
  Palette,
  Trash2,
  Info,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";

function SettingsPage() {

  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();
const [temperature, setTemperature] = useState(0.7);
const [autoRead, setAutoRead] = useState(false);
const [fontSize, setFontSize] = useState("medium");
const [exportFormat, setExportFormat] = useState("pdf");
useEffect(() => {
  const saved = JSON.parse(localStorage.getItem("astra-settings"));

  if (!saved) return;

  setTheme(saved.theme || "dark");
  setTemperature(saved.temperature ?? 0.7);
  setAutoRead(saved.autoRead || false);
  setFontSize(saved.fontSize || "medium");
  setExportFormat(saved.exportFormat || "pdf");
}, []);
useEffect(() => {
  localStorage.setItem(
    "astra-settings",
    JSON.stringify({
      theme,
      temperature,
      autoRead,
      fontSize,
      exportFormat,
    })
  );
}, [
  theme,
  temperature,
  autoRead,
  fontSize,
  exportFormat,
]);
  return (
    <div
  className={`p-8 transition-colors duration-300 ${
    theme === "light"
      ? "text-slate-900"
      : "text-white"
  }`}
>
      <div className="mx-auto max-w-4xl">

   {/* Header */}
<div className="mb-10 flex items-center justify-between">

  <div className="flex items-center gap-4">
    <div className="rounded-xl bg-cyan-500/20 p-3">
      <Settings size={32} className="text-cyan-400" />
    </div>

    <div>
      <h1 className="text-4xl font-bold">
        Settings
      </h1>

      <p className="text-slate-400">
        Customize your Astra AI experience
      </p>
    </div>
  </div>

  <button
    onClick={() => navigate("/chat")}
    className="rounded-xl bg-cyan-500 px-5 py-3 font-medium text-white transition hover:bg-cyan-600"
  >
    ← Back to Chat
  </button>

</div>

        {/* Appearance */}
        <div className={`mb-8 rounded-2xl border p-6 transition-colors duration-300 ${
  theme === "light"
    ? "border-slate-200 bg-white shadow-sm"
    : "border-slate-800 bg-slate-900"
}`}>
          <div className="mb-6 flex items-center gap-3">
            <Palette className="text-cyan-400" />
            <h2 className="text-2xl font-semibold">
              Appearance
            </h2>
          </div>

          <div className="grid gap-4 md:grid-cols-3">

           <button
  onClick={() => setTheme("dark")}
  className={`rounded-xl p-5 transition ${
    theme === "dark"
      ? "border border-cyan-500 bg-cyan-500/20"
      : "border border-slate-700 hover:border-cyan-500"
  }`}
>
  <Moon className="mx-auto mb-3" />
  Dark
</button>

           <button
  onClick={() => setTheme("light")}
  className={`rounded-xl p-5 transition ${
    theme === "light"
      ? "border border-cyan-500 bg-cyan-500/20"
      : "border border-slate-700 hover:border-cyan-500"
  }`}
>
  <Sun className="mx-auto mb-3" />
  Light
</button>

            <button
  onClick={() => setTheme("system")}
  className={`rounded-xl p-5 transition ${
    theme === "system"
      ? "border border-cyan-500 bg-cyan-500/20"
      : "border border-slate-700 hover:border-cyan-500"
  }`}
>
  <Monitor className="mx-auto mb-3" />
  System
</button>

          </div>
        </div>

        {/* AI */}
        <div className={`mb-8 rounded-2xl border p-6 transition-colors duration-300 ${
  theme === "light"
    ? "border-slate-200 bg-white shadow-sm"
    : "border-slate-800 bg-slate-900"
}`}>

          <h2 className="mb-6 text-2xl font-semibold">
            AI
          </h2>

          <label className="mb-3 block">
            Temperature
          </label>

          <input
  type="range"
  min="0"
  max="1"
  step="0.1"
  value={temperature}
  onChange={(e) => setTemperature(Number(e.target.value))}
  className="w-full"
/>

          <div className="mt-6 flex items-center justify-between">

            <div className="flex items-center gap-3">
              <Volume2 />
              Auto Read Aloud
            </div>

           <input
  type="checkbox"
  checked={autoRead}
  onChange={(e) => setAutoRead(e.target.checked)}
  className="h-5 w-5"
/>

          </div>

        </div>

        {/* Chat */}
        <div className={`mb-8 rounded-2xl border p-6 transition-colors duration-300 ${
  theme === "light"
    ? "border-slate-200 bg-white shadow-sm"
    : "border-slate-800 bg-slate-900"
}`}>

          <h2 className="mb-6 text-2xl font-semibold">
            Chat
          </h2>

          <div className="mb-5">

            <label>Font Size</label>

            <select
  value={fontSize}
  onChange={(e) => setFontSize(e.target.value)}
  className="mt-2 w-full rounded-lg bg-slate-800 p-3"
>
              <option value="small">Small</option>
              <option value="medium">Medium</option>
              <option value="large">Large</option>
            </select>

          </div>

          <div>

            <label>Default Export</label>

            <select
  value={exportFormat}
  onChange={(e) => setExportFormat(e.target.value)}
  className="mt-2 w-full rounded-lg bg-slate-800 p-3"
>
              <option value="pdf">PDF</option>
<option value="txt">TXT</option>
<option value="html">HTML</option>
<option value="md">Markdown</option>
<option value="json">JSON</option>
            </select>

          </div>

        </div>

        {/* Data */}
        <div className={`mb-8 rounded-2xl border p-6 transition-colors duration-300 ${
  theme === "light"
    ? "border-slate-200 bg-white shadow-sm"
    : "border-slate-800 bg-slate-900"
}`}>

          <h2 className="mb-6 flex items-center gap-3 text-2xl font-semibold">
            <Trash2 />
            Data
          </h2>

          <button className="rounded-xl bg-red-600 px-6 py-3 transition hover:bg-red-700">
            Clear All Chats
          </button>

        </div>

        {/* About */}
        <div className={`rounded-2xl border p-6 transition-colors duration-300 ${
  theme === "light"
    ? "border-slate-200 bg-white shadow-sm"
    : "border-slate-800 bg-slate-900"
}`}>

          <h2 className="mb-5 flex items-center gap-3 text-2xl font-semibold">
            <Info />
            About
          </h2>

          <p className="mb-2">
            Astra AI v1.0
          </p>

          <p className="mb-2 text-slate-400">
            Built by Mridul Shrimal
          </p>

          <p className="text-slate-500">
            Powered by Gemini API
          </p>

        </div>

      </div>
    </div>
  );
}

export default SettingsPage;